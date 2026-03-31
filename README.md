# Stock-Exchange-Equity-Analytics

## Project Description

Developed a machine learning model to classify investment ratings of 370 publicly listed Polish companies based on financial indicators and sector-specific characteristics.

Built a complete data analysis and modeling pipeline, including data preprocessing, feature engineering, and model training to predict investment categories (low, medium, high).

Although the dataset comes from companies listed on the Warsaw Stock Exchange, the project demonstrates transferable data science and financial analysis skills. Financial indicators such as ROA, EBITDA, and leverage ratios are standardized worldwide, making the modeling approach applicable to global financial markets.


## How to Run

## Repository Structure
- `data/` - raw, labeled and preprocessed datasets (see `data/README.md`)
- `ETL/` - responsible for data extraction, joining financial tables, and initial cleaning before the machine learning phase.
- `notebooks/` - Jupyter notebooks for preprocessing and modeling experiments
- `src/` - Python scripts for preprocessing data and training the final ML model
- `reports/` – Power BI dashboards and related analytics outputs
- `CRISP-DM.md` - detailed methodology workflow
- `airflow/` –  workflow automation layer used for scheduling, orchestrating, and automating data processing and model training pipelines.
- `deployment_aws` - contains the CloudFormation IaC used to provision the entire AWS backend.
- `.github` - holds GitHub Actions workflows that automate build and deployment.

## Tech Stack

- Language: Python 3.10
- Libraries: Scikit-learn, Pandas, NumPy, Matplotlib, TensorFlow (MLP)
- Tools: Power BI, PostgreSQL 
- Backend & Deployment: FastAPI, Pydantic, Uvicorn
- Conterization & Deployment: Docker
- Cloud Technology: Amazon Web Service (AWS)
- Workflow orchestration & automation: Apache Airflow

For the full CRISP-DM methodology, see [CRISP-DM.md](CRISP-DM.md)
