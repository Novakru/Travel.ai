from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许所有来源的请求

# 存储地址信息的二维数组（行表示第几天，列表示第几个地址）
stored_addresses = [
    [],  # 第一天
    [],  # 第二天
    []   # 第三天
]

# 预存储地址信息的二维数组（行表示第几天，列表示第几个地址）
pre_stored_addresses = [
    [{'address': '北京'}, {'address': '天津'}],
    [{'address': '上海'}, {'address': '杭州'}, {'address': '苏州'}],
    [{'address': '广州'}, {'address': '深圳'}]
]

@app.route('/saveAddress', methods=['POST'])
def save_address():
    data = request.get_json()
    address = data.get('address')
    location = data.get('location')
    day_index = data.get('day_index')

    if day_index >= len(stored_addresses):
        stored_addresses.append([])

    stored_addresses[day_index].append({'address': address, 'location': location})
    return jsonify({'success': True, 'message': 'Address received and stored'})

@app.route('/getPreStoredAddresses', methods=['GET'])
def get_pre_stored_addresses():
    return jsonify({'success': True, 'addresses': pre_stored_addresses})

@app.route('/getAddresses', methods=['GET'])
def get_addresses():
    return jsonify({'success': True, 'addresses': stored_addresses})

@app.route('/clearAddresses', methods=['POST'])
def clear_addresses():
    global stored_addresses
    stored_addresses = [[] for _ in range(len(pre_stored_addresses))]
    return jsonify({'success': True, 'message': 'Addresses cleared'})

@app.route('/deleteAddress', methods=['POST'])
def delete_address():
    data = request.get_json()
    address = data.get('address')
    global stored_addresses
    for day in stored_addresses:
        day[:] = [addr for addr in day if addr['address'] != address]
    return jsonify({'success': True, 'message': 'Address deleted'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
