AegisChurn: Enterprise ML Churn Intelligence & Explainable AI Lab
AegisChurn is an end-to-end, production-grade Data Science and Machine Learning platform engineered to detect subscription churn risk, quantify retention economics, and deconstruct non-linear behavioral drivers. Built to demonstrate senior data science capability, the project bridges the gap between theoretical modeling and quantifiable business impact.
What Makes It Effective:
Commercial ML & Financial Optimization: Moves beyond arbitrary 
 decision boundaries. By calibrating a custom cost-benefit matrix balancing customer lifetime value (
) against intervention incentives (
), the system identifies the profit-maximizing threshold (
), delivering 
 in projected net retention savings across a 
-customer cohort.
Statistical Rigor & Feature Engineering: Features comprehensive exploratory data analysis, Kolmogorov-Smirnov distribution divergence tests, and Chi-Square independence testing (
). A Variance Inflation Factor (
) audit eliminates severe collinearity by replacing raw charges with engineered spend velocity and log transforms.
Tournament Benchmarking: Evaluates five candidate architectures using 5-fold stratified cross-validation. An Optuna-tuned XGBoost model emerges as the champion, securing 
 and 
 alongside a well-calibrated 
.
Explainable AI (SHAP) & Counterfactuals: Employs TreeExplainer SHAP to provide local additive waterfall attributions. A live "what-if" simulator demonstrates how prescriptive actions (e.g., upgrading from month-to-month to annual commitments with tech support) can reduce individual churn risk by over 
.
Production MLOps & Health: Tracks real-time inference latency (
) and detects covariate shift via the Population Stability Index (PSI) with automated retraining thresholds.
The Complete Package:
Packaged with an interactive web lab and a one-click exportable GitHub repository containing production-ready Python pipelines, executed Jupyter notebooks, Pytest test suites, Docker containerization, a standardized Model Card, and automated GitHub Actions CI/CD workflows.
