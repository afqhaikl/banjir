from flask import Flask, render_template, jsonify
import requests
import pandas as pd
import json

app = Flask(__name__)

def fetch_flood_data():
    url = "https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php"
    params = {
        "a": "0",
        "b": "0",
        "seasonmain_id": "208",
        "seasonnegeri_id": ""
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

@app.route('/api/flood-data')
def get_flood_data():
    data = fetch_flood_data()
    return jsonify(data)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
