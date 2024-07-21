from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
map_bp = Blueprint('map', __name__)
CORS(map_bp)  # 允许所有来源的请求

stored_addresses = [
    # [{'address': '故宫博物院'}, {'address': '天安门广场'}, {'address': '王府井大街'}],
    # [{'address': '颐和园'}, {'address': '圆明园'}, {'address': '北海公园'}],
    # [{'address': '天坛'}, {'address': '国家博物馆'}, {'address': '798艺术区'}]
]

geocode_info = {'region': '北京'}

@map_bp.route('/getGeocodeInfo', methods=['GET'])
def get_geocode_info():
    return jsonify({'success': True, 'geocode_info': geocode_info})

@map_bp.route('/getAddresses', methods=['GET'])
def get_addresses():
    return jsonify({'success': True, 'addresses': stored_addresses})

@map_bp.route('/data', methods=['POST'])
def receive_data():
    data = request.json.get('data')
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400

    try:
        itinerary = json.loads(data)
    except json.JSONDecodeError:
        return jsonify({'success': False, 'message': 'Invalid JSON format'}), 400

    global stored_addresses
    stored_addresses = []  # 清空当前存储的数据，后期存储进入数据库

    for day in itinerary.values():
        day_addresses = []
        for time_period in day.values():
            for activity in time_period:
                day_addresses.append({'address': activity['地点']})
        stored_addresses.append(day_addresses)
    print('Stored addresses:', stored_addresses)

    return jsonify({'success': True, 'message': 'Data received successfully'})


app.register_blueprint(map_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
