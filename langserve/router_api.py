from fastapi import APIRouter
from starlette.responses import StreamingResponse
from pydantic import BaseModel
from chain_wrapper import chat as chat_chain

from langchain_core.messages import AIMessageChunk

class Item(BaseModel):
    content: str

router = APIRouter()

async def generate_response(content):
    # chat_chain.config["configurable"]["session_id"] = time.time()
    print(chat_chain.config)
    async for message_chunk in chat_chain.with_message_history.astream(
        {"content":content},
        config=chat_chain.config
    ):
        # 确保将AIMessageChunk对象转换为字符串
        if isinstance(message_chunk, AIMessageChunk):
            message_str = str(message_chunk.content)
        else:
            message_str = message_chunk.content
        
        # 将字符串编码为字节流
        yield message_str.encode('utf-8')
    
@router.post("/chain/tagging_pure")
async def chat(item:Item):
    print("传输的参数为：",item.content)
    return StreamingResponse(generate_response(item.content),media_type="text/event-stream")