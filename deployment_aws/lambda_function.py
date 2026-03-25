import os 
import boto3
import joblib
import json 
import numpy as np 

# Infrastructure Constants - Pointing to S3 assets managed via IaC 
S3_BUCKET = "pqa-bucket"
MODEL_KEY = "pipeline_rf.joblib"

# Global AWS Client initialization to leverage connection pooling across Lambda invocations
s3 = boto3.client("s3")

# Global variable for Lazy Loading pattern 
model = None

def load_model():
    """
    Downloads the serialized model from S3 and loads it into memory.
    Implements local caching in /tmp to minimize S3 egress costs and latency.
    """
    local_path = "/tmp/pipeline_rf.joblib"

    # Check for local cache to avoid redundant network overhead
    if not os.path.exists(local_path):
        s3.download_file(S3_BUCKET, MODEL_KEY, local_path)

    return joblib.load(local_path)


def lambda_handler(event, context):
    """
    Main entry point for AWS Lambda. Handles JSON event parsing, 
    model initialization, and high-performance inference.
    """
    global model

    # --- Lazy Loading Strategy: Avoids expensive re-initialization during warm starts --- 
    if model is None:
        model = load_model()

    # --- Dynamic payload extraction: Supports both API Gateway (proxy) and direct invocation --- 
    if "body" in event:
        body = json.loads(event["body"])
    else:
        body = event

    data = body.get("data")
    
    # --- Input Validation: Crucial for production-grade robustness --- 
    if data is None:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing 'data' field in request"})
        }

    try:
        input_array = np.array(data)
        input_data_reshaped = input_array.reshape(1, -1)

        # --- Execute Prediction using the pre-loaded Scikit-Learn/Joblib pipeline --- 
        prediction = model.predict(input_data_reshaped)
        label = prediction[0]

    except Exception as e: 
        print(f"Error during prediction: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Prediction failed", "details": str(e)})
        }

    # --- Map classification label to business-logic response format --- 
    # --- Using hardcoded probabilities for discrete classification results --- 
    if label == "high":
        result = {"high": 100, "middle": 0, "low": 0}
    elif label == "middle":
        result = {"high": 0, "middle": 100, "low": 0}
    else:
        result = {"high": 0, "middle": 0, "low": 100}

    # --- Standard production return format for AWS Lambda integrated with API Gateway --- 
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS"

        },
        "body": json.dumps(result)
    }