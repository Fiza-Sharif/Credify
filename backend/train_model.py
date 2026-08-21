import os
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

def train_and_save_model():
    print("Loading train.csv...")
    dataset_path = os.path.join(os.path.dirname(__file__), "train.csv")
    df = pd.read_csv(dataset_path)

    # 1. Feature Columns & Target Encoding
    num_cols = ["ApplicantIncome", "CoapplicantIncome", "LoanAmount", "Loan_Amount_Term", "Credit_History"]
    cat_cols = ["Gender", "Married", "Dependents", "Education", "Self_Employed", "Property_Area"]

    X = df[num_cols + cat_cols].copy()
    y = df["Loan_Status"].map({"Y": 1, "N": 0})

    print(f"Dataset Shape: {X.shape}")
    print(f"Target Distribution: Approved (1) = {sum(y==1)}, Rejected (0) = {sum(y==0)}")

    # 2. Split dataset: 80% Train, 20% Test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    # 3. Build Unified Scikit-Learn Pipelines
    num_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    cat_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(transformers=[
        ('num', num_transformer, num_cols),
        ('cat', cat_transformer, cat_cols)
    ])

    # 4. Use K = 7
    best_k = 7

    # 5. Fit Final Master Pipeline with K=7
    final_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', KNeighborsClassifier(n_neighbors=best_k))
    ])
    final_pipeline.fit(X_train, y_train)

    # Verify final predictions on test set
    final_preds = final_pipeline.predict(X_test)
    final_acc = accuracy_score(y_test, final_preds)
    print(f"Final Pipeline Accuracy on Test Set (K={best_k}): {final_acc * 100:.2f}%")
    print(f"Pipeline Classes: {final_pipeline.classes_}")

    # 6. Save Single Unified Pipeline Artifact
    model_dir = os.path.join(os.path.dirname(__file__), "model")
    os.makedirs(model_dir, exist_ok=True)
    pipeline_path = os.path.join(model_dir, "knn_pipeline.joblib")

    joblib.dump(final_pipeline, pipeline_path)
    print(f"Unified Sklearn Pipeline successfully saved to {pipeline_path}")

if __name__ == "__main__":
    train_and_save_model()
