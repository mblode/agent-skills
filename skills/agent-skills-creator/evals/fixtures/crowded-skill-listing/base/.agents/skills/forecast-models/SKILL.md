---
name: forecast-models
description: Guidance for the demand forecasting models that predict parcel volume per depot for the Mossback capacity planner. Covers model training, model features, feature engineering, training data, holdout windows, model accuracy, error metrics, model retraining, model versions, model registry entries, model rollout, and model rollback. Also covers the nightly training job, the weekly accuracy report, how forecasts are written to the planner tables, and how a depot manager's manual override interacts with a forecast. Helps with adding a feature, diagnosing a bad forecast, retraining after a holiday period, and promoting a new model version. Use when the user mentions a forecast, the planner, demand, capacity, volume prediction, a model, training, accuracy, features, or retraining, or asks why a depot's forecast is wrong or how to improve it. Always follows the Mossback platform conventions, house style, and established best practices.
---

# Forecast Models

## Rules

- Training code lives in `forecast/train.py`; features in `forecast/features/`.
- The holdout window is always the most recent 28 days. Do not tune on it.
- A new model version is promoted with `python -m forecast.promote <version>` only when its error on the holdout beats the live version for at least 80% of depots.
- A manual override in `planner_overrides` always wins over a forecast for its date range.
