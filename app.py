import os
import re
import joblib
from flask import Flask, render_template, request, jsonify

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'logistic_regression_model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'tfidf_vectorizer.pkl')

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

SIGNALS = [
    (r'\b(urgent|immediately|act now|final warning|within 24 hours|expires today)\b', 'Urgent or pressuring language'),
    (r'\b(verify|confirm|reset|update)\b.{0,45}\b(account|password|identity|details|credentials|bank)\b', 'Request to verify or update sensitive details'),
    (r'\b(won|winner|prize|gift card|claim your reward|free money)\b', 'Unexpected prize or reward language'),
    (r'\b(suspended|blocked|locked|unusual activity|security alert)\b', 'Account-threat or security scare language'),
    (r'\b(password|one[- ]time password|otp|credit card|bank account)\b', 'Mentions sensitive information'),
    (r'https?://|www\.', 'Contains a web link'),
    (r'\b(click here|tap here|open the link|download now)\b', 'Encourages clicking or downloading'),
]

def find_signals(message):
    return [label for pattern, label in SIGNALS if re.search(pattern, message, re.I)]

@app.get('/')
def home():
    return render_template('index.html')

@app.get('/health')
def health():
    return jsonify({'status': 'ok', 'model_ready': True})

@app.post('/predict')
def predict():
    data = request.get_json(silent=True) or request.form
    if not data:
        return jsonify({'error': "Send JSON containing a 'message' field."}), 400
    message = str(data.get('message', data.get('text', ''))).strip()
    if not message:
        return jsonify({'error': 'Please enter a message to scan.'}), 400
    try:
        features = vectorizer.transform([message])
        prediction = int(model.predict(features)[0])
        probabilities = model.predict_proba(features)[0]
        classes = list(model.classes_)
        risk_idx = classes.index(1) if 1 in classes else len(probabilities) - 1
        score = float(probabilities[risk_idx])
        signals = find_signals(message)
        status = 'Phishing / High Risk' if prediction == 1 else 'Likely Safe'
        recommendation = (
            'Do not click links or share personal information. Verify the sender using an official website or phone number.'
            if prediction == 1 else
            'The model did not flag this message as high risk. Still verify the sender and links before taking action.'
        )
        return jsonify({
            'status': status,
            'is_high_risk': prediction,
            'prediction': prediction,
            'risk_score': round(score * 100, 1),
            'signals': signals,
            'recommendation': recommendation,
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
