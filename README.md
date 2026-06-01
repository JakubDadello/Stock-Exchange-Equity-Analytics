# Stock-Exchange-Equity-Analytics

tagline: Fast Investment Assessment Engine

## Project Description

Developed a machine learning model to classify investment ratings of publicly listed companies based on financial indicators and sector-specific characteristics with planned extension to multiple international markets. 

Built a complete data analysis and modeling pipeline, including data preprocessing, feature engineering, and model training to predict investment categories (low, medium, high). Deployed on AWS using Infrastructure as Code (IaC). 

Applied classification algorithms to identify patterns in financial data and support data-driven investment decision-making.

Although the dataset is based on companies listed on the Warsaw Stock Exchange, the project focuses on widely used financial indicators such as ROA, EBITDA margins, and leverage ratios, which are common across global equity markets. This allows the methodology and modeling approach to be adapted to other regions with similar financial reporting standards.

## How to run 

Link to the website: stock-exchange-equity-analytics.vercel.app

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
- Conterization & Deployment: Docker
- Cloud Technology: Amazon Web Service (AWS)
- IaC: Cloud Formation in AWS
- CI/CD: GitHub Actions
- Workflow orchestration & automation: Apache Airflow
- Frontend/UI: TypeScript/JavaScript, HTML, CSS

For the full CRISP-DM methodology, see [CRISP-DM.md](CRISP-DM.md)
