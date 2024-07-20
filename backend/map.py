# 示例 Flask 后端代码
from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
map_bp = Blueprint('map', __name__)
CORS(map_bp)  # 允许所有来源的请求

stored_addresses = [
    [{'address': '故宫博物院'}, {'address': '天安门广场'}, {'address': '王府井大街'}],
    [{'address': '颐和园'}, {'address': '圆明园'}, {'address': '北海公园'}],
    [{'address': '天坛'}, {'address': '国家博物馆'}, {'address': '798艺术区'}]
]

geocode_info = {'region': '北京'}

@map_bp.route('/getGeocodeInfo', methods=['GET'])
def get_geocode_info():
    return jsonify({'success': True, 'geocode_info': geocode_info})

@map_bp.route('/getAddresses', methods=['GET'])
def get_addresses():
    return jsonify({'success': True, 'addresses': stored_addresses})

app.register_blueprint(map_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
