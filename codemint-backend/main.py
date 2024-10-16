import os
import openai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .ipfs_utils import add_to_ipfs, get_from_ipfs
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class CodeSnippet(BaseModel):
    language: str
    code: str

# Set up OpenRouter client
openai.api_base = "https://openrouter.ai/api/v1"
openai.api_key = os.getenv("OPENROUTER_API_KEY")

def generate_code_with_ai(language: str, prompt: str):
    try:
        response = openai.ChatCompletion.create(
            model="microsoft/phi-3.5-mini-128k-instruct",
            messages=[
                {"role": "system", "content": f"You are an expert programmer proficient in multiple programming languages. Generate high-quality, efficient, and well-documented code in {language} based on the user's prompt."},
                {"role": "user", "content": f"Generate {language} code for: {prompt}"}
            ]
        )
        return response.choices[0].message['content']
    except Exception as e:
        logger.error(f"Error in generate_code_with_ai: {str(e)}")
        raise

def optimize_code_with_ai(language: str, code: str):
    try:
        response = openai.ChatCompletion.create(
            model="microsoft/phi-3.5-mini-128k-instruct",
            messages=[
                {"role": "system", "content": f"You are an expert programmer specializing in code optimization for various languages. Analyze the given {language} code and provide an optimized version with explanations for your changes."},
                {"role": "user", "content": f"Optimize this {language} code:\n\n{code}"}
            ]
        )
        return response.choices[0].message['content']
    except Exception as e:
        logger.error(f"Error in optimize_code_with_ai: {str(e)}")
        raise

def debug_code_with_ai(language: str, code: str):
    try:
        response = openai.ChatCompletion.create(
            model="microsoft/phi-3.5-mini-128k-instruct",
            messages=[
                {"role": "system", "content": f"You are an expert debugger proficient in multiple programming languages. Analyze the given {language} code, identify any issues or potential improvements, and provide a detailed explanation of your findings."},
                {"role": "user", "content": f"Debug this {language} code and provide a list of issues and suggestions:\n\n{code}"}
            ]
        )
        return response.choices[0].message['content']
    except Exception as e:
        logger.error(f"Error in debug_code_with_ai: {str(e)}")
        raise

@app.get("/")
async def root():
    return {"message": "Welcome to Intellimint AI - Your multilingual coding assistant"}

@app.post("/generate")
async def generate_code(language: str, prompt: str):
    try:
        generated_code = generate_code_with_ai(language, prompt)
        ipfs_hash = add_to_ipfs(generated_code)
        if ipfs_hash:
            return {"generated_code": generated_code, "ipfs_hash": ipfs_hash, "language": language}
        raise HTTPException(status_code=500, detail="Failed to store code in IPFS")
    except Exception as e:
        logger.error(f"Error in generate_code: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize")
async def optimize_code(snippet: CodeSnippet):
    try:
        optimized_code = optimize_code_with_ai(snippet.language, snippet.code)
        ipfs_hash = add_to_ipfs(optimized_code)
        if ipfs_hash:
            return {"optimized_code": optimized_code, "ipfs_hash": ipfs_hash, "language": snippet.language}
        raise HTTPException(status_code=500, detail="Failed to store code in IPFS")
    except Exception as e:
        logger.error(f"Error in optimize_code: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/debug")
async def debug_code(snippet: CodeSnippet):
    try:
        debug_info = debug_code_with_ai(snippet.language, snippet.code)
        ipfs_hash = add_to_ipfs(debug_info)
        if ipfs_hash:
            return {"debug_info": debug_info, "ipfs_hash": ipfs_hash, "language": snippet.language}
        raise HTTPException(status_code=500, detail="Failed to store debug info in IPFS")
    except Exception as e:
        logger.error(f"Error in debug_code: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/retrieve/{ipfs_hash}")
async def retrieve_from_ipfs(ipfs_hash: str):
    try:
        content = get_from_ipfs(ipfs_hash)
        if content:
            return {"content": content}
        raise HTTPException(status_code=404, detail="Content not found in IPFS")
    except Exception as e:
        logger.error(f"Error in retrieve_from_ipfs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)