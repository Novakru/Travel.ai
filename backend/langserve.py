import logging
from flask import Blueprint, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv, find_dotenv
from zhipuai import ZhipuAI

# Load environment variables
_ = load_dotenv(find_dotenv())

# Get the API key from environment variables
api_key = os.environ["ZHIPUAI_KEY"]
if not api_key:
    raise ValueError("API key is missing. Please check your .env file.")
else:
    print(f"Loaded API key: {api_key}")  # 添加这一行用于调试

# Initialize the ZhipuAI client
client = ZhipuAI(api_key=api_key)

# Function to get completion from ZhipuAI
def get_completion(prompt, model="glm-4"):
    messages = [
        {"role": "user", "content": prompt},
    ]
    response = client.chat.completions.create(
        model=model,  # Model name
        temperature=0.0,
        messages=messages
    )

    return response.choices[0].message.content

# Create a Flask Blueprint
langserve = Blueprint('langserve', __name__)
CORS(langserve)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@langserve.route("/recommend-travel-plan", methods=["POST"])
def recommend_travel_plan():
    data = request.get_json()
    logging.debug(f"Received data: {data}")
    
    user_input = data.get('location')
    if not user_input:
        logging.error("No input provided")
        return jsonify({"error": "No input provided"}), 400
    
    logging.debug(f"User input: {user_input}")

    try:
        response_content = get_completion(user_input)
        logging.debug(f"Model response: {response_content}")
        
        return jsonify({"response": response_content})
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
