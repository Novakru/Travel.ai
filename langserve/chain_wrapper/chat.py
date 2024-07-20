import os
from dotenv import load_dotenv,find_dotenv
from langchain_openai import ChatOpenAI
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
import time

_ = load_dotenv(find_dotenv())

model = ChatOpenAI(
    base_url="https://open.bigmodel.cn/api/paas/v4",
    api_key=os.environ.get('ZHIPUAI_KEY'),
    model="glm-4",
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system","你是一位乐于助人的助手。尽你所能回答所有问题。"),
        # ("system","You are a helpful assistant. Answer all questions to the best of your ability."),
        ("user","{content}")
    ]
)

chain = prompt | model

store = {}

def get_session_history(session_id:str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

with_message_history = RunnableWithMessageHistory(chain,get_session_history)

config = {
    "configurable":{
        "session_id":time.time(),
    }
}

