from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
import json

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

@map_bp.route('/data', methods=['POST'])
def receive_data():
    data = request.json.get('data')
    print('Data:', data)
    # dict_data = json.loads(data)
    # print(dict_data)

    global stored_addresses
    stored_addresses = []

    for day, activities in data.items():
        day_addresses = []
        for time_period, places in activities.items():
            for place in places:
                day_addresses.append({'address': place['地点']})
        stored_addresses.append(day_addresses)
    
    print(stored_addresses)

    return jsonify({'success': True, 'message': 'Data received successfully'})


app.register_blueprint(map_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
