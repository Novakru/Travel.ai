import os
import time
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from langchain_openai import ChatOpenAI
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessageChunk  # 确保导入 AIMessageChunk

# Load environment variables
_ = load_dotenv(find_dotenv())

# Initialize the chat model
model = ChatOpenAI(
    base_url="https://open.bigmodel.cn/api/paas/v4",
    api_key=os.environ.get('ZHIPUAI_KEY'),
    model="glm-4",
)

# Define the chat prompt template
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "你是一位乐于助人的助手。尽你所能回答所有问题。"),
        ("user", "{input}")
    ]
)

# Combine the prompt template and model into a chain
chain = prompt | model

# Store for session histories
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

with_message_history = RunnableWithMessageHistory(chain, get_session_history)

config = {
    "configurable": {
        "session_id": 1,
    }
}

class Item(BaseModel):
    content: str

router = APIRouter()

async def generate_response(content: str, session_id: str):
    history = get_session_history(session_id)
    # 将历史记录和当前消息结合
    full_message = history.messages + [{"role": "user", "content": content}]
    
    async for message_chunk in with_message_history.astream(
        {"content": content},
        config={"configurable": {"session_id": session_id}}
    ):
        if isinstance(message_chunk, AIMessageChunk):
            message_str = str(message_chunk.content)
        else:
            message_str = message_chunk.content
        
        yield message_str.encode('utf-8')

@router.post("/chain/chat")
async def chat(item: Item):
    session_id = "unique_session_id"  # 使用实际的用户 ID 或会话 ID
    print("传输的参数为：", item.content)
    return StreamingResponse(generate_response(item.content, session_id), media_type="text/event-stream")

