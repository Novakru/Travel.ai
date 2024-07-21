import requests
import json

# 定义要发送的数据
data = {
    "input": "你的输入文本"
}

# 发送 POST 请求到 /chain/tagging 端点
response = requests.post(
    "http://localhost:8000/chain/tagging",
    headers={"Content-Type": "application/json"},
    data=json.dumps(data)
)

# 输出响应内容
if response.status_code == 200:
    print("响应内容:", response.json())
else:
    print("请求失败:", response.status_code, response.text)
