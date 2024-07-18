from flask import Blueprint, request, jsonify
from flask_cors import CORS

login = Blueprint('login', __name__)
CORS(login)  # 允许所有来源的请求

# 示例用户数据
users = {
    "user@example.com": "password123"
}

@login.route('/login', methods=['POST'])
def login_route():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email in users and users[email] == password:
        return jsonify({'success': True, 'message': '登录成功'})
    else:
        return jsonify({'success': False, 'message': '登录失败，邮箱或密码错误'})
