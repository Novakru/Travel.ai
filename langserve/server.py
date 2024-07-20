from typing import List

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.chat_models import ChatZhipuAI
from langserve import add_routes
from dotenv import load_dotenv,find_dotenv
from chain_wrapper import tagging,tagging_pure
from router_api import router
from langchain_openai import ChatOpenAI
import os


# 1. Create prompt template
system_template = "Translate the following into {language}:"
prompt_template = ChatPromptTemplate.from_messages([
    ("system",system_template),
    ("user","{text}")
])

# 2 获取你的智谱 API Key
_ = load_dotenv(find_dotenv())

# 3. Create model
model = ChatZhipuAI(model="glm-4",temperature=0.5)

# 4.create parser
parser = StrOutputParser()

# 5. Create chain
chain = prompt_template | model | parser

# 6. App definition
app = FastAPI(
    title="LangServe Demo",
    description="使用 LangChain 的 Runnable 接口的简单 API 服务器",
    version="0.0.1"
)

# 7. Adding chain route
add_routes(
    app,
    chain,
    path="/chain",
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

llm = ChatOpenAI(
    base_url="https://open.bigmodel.cn/api/paas/v4",
    api_key=os.environ.get('ZHIPUAI_KEY'),
    model="glm-4",
)
prompt = ChatPromptTemplate.from_template("tell me a joke about {topic}")
add_routes(
    app,
    prompt | llm,
    path="/joke",
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
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)


"""
python serve.py

每个 LangServe 服务都带有一个简单的内置 UI，用于配置和调用应用程序，并提供流式输出和中间步骤的可见性。
前往 http://localhost:8000/chain/playground/ 试用！
传入与之前相同的输入 - {"language": "chinese", "text": "hi"} - 它应该会像以前一样做出响应。
"""