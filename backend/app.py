# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许所有来源的请求

# 存储地址信息的列表
stored_addresses = []

@app.route('/saveAddress', methods=['POST'])
def save_address():
    data = request.get_json()
    address = data.get('address')
    location = data.get('location')

    # 存储地址和坐标信息
    stored_addresses.append({'address': address, 'location': location})

    return jsonify({'success': True, 'message': 'Address received and stored'})

@app.route('/getAddresses', methods=['GET'])
def get_addresses():
    return jsonify({'success': True, 'addresses': stored_addresses})

@app.route('/clearAddresses', methods=['POST'])
def clear_addresses():
    global stored_addresses
    stored_addresses = []
    return jsonify({'success': True, 'message': 'Addresses cleared'})

@app.route('/deleteAddress', methods=['POST'])
def delete_address():
    data = request.get_json()
    address = data.get('address')

    global stored_addresses
    stored_addresses = [addr for addr in stored_addresses if addr['address'] != address]

    return jsonify({'success': True, 'message': 'Address deleted'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
