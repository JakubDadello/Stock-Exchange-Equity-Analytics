import os 
import boto3
import joblib
import json 

S3_BUCKET = "pqa-bucket"
MODEL_KEY = "pipeline_rf.joblib"

s3 = boto3.client("s3")
model = None

def load_model():
    
    local_path = "/tmp/pipeline_rf.joblib"

    if not os.path.exists(local_path):
        s3.download_file(S3_BUCKET, MODEL_KEY, local_path)

    return joblib.load(local_path)


def lambda_handler(event, context):
    global model

    if model is None:
        model = load_model()

    if "body" in event:
        body = json.loads(event["body"])
    else:
        body = event

    data = body.get("data")
    
    if data is None:
        return {"error": "Missing 'data' field in request"}

    prediction = model.predict(data)

    return {
        "input": data,
        "prediction": prediction.tolist()
    }