from flask import Flask
from flask_cors import CORS
from map import map_bp
from login import login
from langserve import langserve
import os
from dotenv import load_dotenv,find_dotenv
_ = load_dotenv(find_dotenv())

# Get the API key from environment variables
api_key = os.environ["ZHIPUAI_API_KEY"]
if not api_key:
    raise ValueError("API key is missing. Please check your .env file.")
else:
    print(f"10000000Loaded API key: {api_key}")  # 添加这一行用于调
    print(os.environ)
main_app = Flask(__name__)
CORS(main_app, resources={r"/*": {"origins": "*"}})

main_app.register_blueprint(map_bp, url_prefix='/map')
main_app.register_blueprint(login, url_prefix='/login')
main_app.register_blueprint(langserve, url_prefix='/langserve')

if __name__ == '__main__':
    main_app.run(debug=True, port=5000)
