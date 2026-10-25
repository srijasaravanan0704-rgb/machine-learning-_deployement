# PhishShift Professional Website

A custom responsive Flask website that uses the supplied Logistic Regression model and TF-IDF vectorizer. The `/predict` endpoint accepts either `{"message":"..."}` or `{"text":"..."}` so it can also match the current Colab API payload shape.

## Run locally
Use Python 3.10+ in this folder:

```bash
pip install -r requirements.txt
python app.py
```
Then open http://127.0.0.1:5000.

## Deploy as a public website
This project needs Python hosting. One option is Render:
1. Upload this folder to a GitHub repository.
2. In Render, create a new Web Service and connect the repository.
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app`
5. Deploy and open the URL Render gives you.

The included `render.yaml` is a starting point. Vercel can host frontend projects but a standard always-on Flask app is usually simpler on a Python web host.

## Important limitation
This is an educational prototype. The model in the supplied notebook may have been trained on PDF text or synthetic/rule-labeled examples rather than a large independently validated phishing dataset. The score is a model probability, not a calibrated real-world risk score. A “Likely Safe” result does not prove a message is safe.
