<<<<<<< HEAD
FROM public.ecr.aws/lambda/python:3.10

# --- Copy requirements file ---  
COPY requirements.txt .

# --- Install dependencies ---
RUN pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# --- Copy Lamba code --- 
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

# --- Start the application ---- 
=======
FROM public.ecr.aws/lambda/python:3.10

# --- Copy requirements file ---  
COPY requirements.txt .

# --- Install dependencies ---
RUN pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# --- Copy Lamba code --- 
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

# --- Start the application ---- 
>>>>>>> 6e10e057f5633264692b1aded85495f1fe9fdc03
CMD ["lambda_function.lambda_handler"]