from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, find_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage

# Load environment variables
_ = load_dotenv(find_dotenv())

# Initialize the model
model = ChatOpenAI(
    base_url="https://open.bigmodel.cn/api/paas/v4",
    api_key=os.environ["ZHIPUAI_API_KEY"],
    model="glm-4",
)

# Define the prompt template
template_string = """你是一位旅游推荐助手，用户想去{location}旅游，请你给用户推荐一个在{location}的三天时间，其中每天分为早中晚的旅游攻略。尽可能覆盖{location}的所有知名景点。"""
prompt_template = ChatPromptTemplate.from_template(template_string)

# Initialize the output parser
parser = StrOutputParser()

# Create the chain
chain = prompt_template | model | parser

class TravelPlanRequest(BaseModel):
    location: str

# Initialize the FastAPI app
app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recommend-travel-plan")
async def recommend_travel_plan(request: TravelPlanRequest):
    prompt = prompt_template.format(location=request.location)
    async def event_generator():
        try:
            response = chain.invoke([HumanMessage(content=prompt)])
            parsed_response = parser.parse(response)
            for char in parsed_response:
                if char == '\n':
                    yield "data: \\n\n\n"
                else:
                    yield f"data: {char}\n\n"
                await asyncio.sleep(0.05)  # Simulate streaming delay for demonstration
        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
