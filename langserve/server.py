from langserve import add_routes
from chain_wrapper import tagging,tagging_pure,chat
from router_api import router
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import mysql.connector
from mysql.connector import Error
import json
import uuid

app = FastAPI(
    title="LangServe Demo",
    description="使用 LangChain 的 Runnable 接口的简单 API 服务器",
    version="0.0.1"
)
 
class Message(BaseModel):
    type: str
    content: dict
    position: str
    user: dict

def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host='36.158.228.122',
            port='23124',
            user='root',
            password='20040901(jy)',
            database='travelai'
        )
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

@app.post("/chat/{session_id}")
async def save_message(session_id: str, message: Message):
    connection = create_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            "INSERT INTO messages (session_id, type, content, position, user) VALUES (%s, %s, %s, %s, %s)",
            (session_id, message.type, json.dumps(message.content), message.position, json.dumps(message.user))
        )
        connection.commit()
        cursor.close()
        connection.close()
    except Error as e:
        cursor.close()
        connection.close()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    return {"message": "Message saved successfully"}

@app.get("/chat/{session_id}")
async def get_messages(session_id: str):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM messages WHERE session_id=%s", (session_id,))
        messages = cursor.fetchall()
        cursor.close()
        connection.close()
        if not messages:
            raise HTTPException(status_code=404, detail="Session not found")
        return {"messages": messages}
    except Error as e:
        cursor.close()
        connection.close()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/get_sessions/{record_id}")
async def get_sessions(record_id: str):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        print(f"Received record_id: {record_id}")  # 打印收到的 record_id
        # 假设 record_id 是 session_id，先找到对应的 userid
        cursor.execute("SELECT user_id FROM sessions WHERE session_id=%s", (record_id,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Record ID not found")

        user_id = result['user_id']
        print(f"Found user_id: {user_id}")  # 打印找到的 user_id
        
        # 查找相同 user_id 的所有 sessionid
        cursor.execute("SELECT DISTINCT session_id FROM sessions WHERE user_id=%s", (user_id,))
        session_ids = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        if not session_ids:
            raise HTTPException(status_code=404, detail="No sessions found for the user")
        
        return {"sessionIds": [s['session_id'] for s in session_ids]}
    except Error as e:
        print(f"Database error: {e}")  # 打印数据库错误信息
        cursor.close()
        connection.close()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.post("/new_session/{current_session_id}")
async def create_new_session(current_session_id: str):
    connection = create_connection()
    cursor = connection.cursor()
    try:
        # 查找 current_session_id 对应的 user_id
        cursor.execute("SELECT user_id FROM sessions WHERE session_id=%s", (current_session_id,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Current session ID not found")

        user_id = result[0]
        new_session_id = str(uuid.uuid4())

        # 插入新的 session_id
        cursor.execute("INSERT INTO sessions (user_id, session_id) VALUES (%s, %s)", (user_id, new_session_id))
        connection.commit()

        cursor.close()
        connection.close()

        return {"new_session_id": new_session_id}
    except Error as e:
        cursor.close()
        connection.close()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

add_routes(
    app,
    tagging_pure.tagging_chain,
    path="/chain/tagging_pure",
)

add_routes(
    app,
    tagging.tagging_chain,
    path="/chain/tagging",
)


add_routes(
    app,
    chat.chain,
    path="/chain/chat",
)

from fastapi.middleware.cors import CORSMiddleware
# 允许所有来源访问，允许所有方法和标头
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头
)

#10 get api
@app.get("/baike")
def baike(action,list,srsearch,format):
    print(action,list,srsearch,format)
    return {"query":{
        "search":[
            {"snippet":"xxxxxxx"}
        ]
    }}

#11 加载自定义路由
app.include_router(router)

if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8000)

