from fastapi import FastAPI
from langserve import add_routes
from chain_wrapper import tagging,tagging_pure,chat
from router_api import router

import uvicorn

app = FastAPI(
    title="LangServe Demo",
    description="使用 LangChain 的 Runnable 接口的简单 API 服务器",
    version="0.0.1"
)
 
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
    allow_origins=["*"],
    allow_methods=["*"],
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

