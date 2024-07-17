# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许所有来源的请求

# 存储地点的数组
stored_addresses = [
    {"address": "北京", "location": None},
    {"address": "天津", "location": None},
    {"address": "石家庄", "location": None}
]

@app.route('/getAddresses', methods=['GET'])
def get_addresses():
    return jsonify({'success': True, 'addresses': stored_addresses})

@app.route('/updateAddresses', methods=['POST'])
def update_addresses():
    data = request.get_json()
    addresses = data.get('addresses')

    if not addresses:
        return jsonify({'success': False, 'message': 'Addresses are required'}), 400

    # 更新地点
    global stored_addresses
    stored_addresses = addresses

    return jsonify({'success': True, 'message': 'Addresses updated'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
