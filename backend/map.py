from flask import Blueprint, request, jsonify
from flask_cors import CORS

map_bp = Blueprint('map', __name__)
CORS(map_bp)  # 允许所有来源的请求

# 存储地址信息的二维数组（行表示第几天，列表示第几个地址）
stored_addresses = []

# 预存储地址信息的二维数组（行表示第几天，列表示第几个地址）
pre_stored_addresses = [
    [{'address': '故宫博物院'}, {'address': '天安门广场'}, {'address': '王府井大街'}],
    [{'address': '颐和园'}, {'address': '圆明园'}, {'address': '北海公园'}],
    [{'address': '天坛'}, {'address': '国家博物馆'}, {'address': '798艺术区'}]
]

# 预设地理编码信息
geocode_info = {'region': '北京'}

@map_bp.route('/getGeocodeInfo', methods=['GET'])
def get_geocode_info():
    return jsonify({'success': True, 'geocode_info': geocode_info})

@map_bp.route('/getPreStoredAddresses', methods=['GET'])
def get_pre_stored_addresses():
    return jsonify({'success': True, 'addresses': pre_stored_addresses})

@map_bp.route('/getAddresses', methods=['GET'])
def get_addresses():
    return jsonify({'success': True, 'addresses': stored_addresses})

@map_bp.route('/saveAddress', methods=['POST'])
def save_address():
    data = request.get_json()
    address = data.get('address')
    location = data.get('location')
    day_index = data.get('day_index')
    address_index = data.get('address_index')

    # 确保存储地址的数组具有预存储地址数组的形状
    while day_index >= len(stored_addresses):
        stored_addresses.append([None] * len(pre_stored_addresses[day_index]))

    # 存储地址信息
    stored_addresses[day_index][address_index] = {'address': address, 'location': location}
    return jsonify({'success': True, 'message': 'Address received and stored'})

@map_bp.route('/clearAddresses', methods=['POST'])
def clear_addresses():
    global stored_addresses
    stored_addresses = [[None for _ in range(len(day))] for day in pre_stored_addresses]
    return jsonify({'success': True, 'message': 'Addresses cleared'})

if __name__ == '__main__':
    map_bp.run(debug=True, port=5000)
