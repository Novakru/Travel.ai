from flask import Flask
from flask_cors import CORS
from map import map_bp
from login import login

main_app = Flask(__name__)
CORS(main_app, resources={r"/*": {"origins": "*"}})

main_app.register_blueprint(map_bp, url_prefix='/map')
main_app.register_blueprint(login, url_prefix='/login')


if __name__ == '__main__':
    main_app.run(debug=True, port=5000)
