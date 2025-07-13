from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import time
from typing import AsyncGenerator

app = FastAPI(title="SSE Text Stream API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "SSE Text Stream API - Use /sse?text=YourMessage to stream text character by character"}

@app.get("/sse")
async def sse_endpoint(text: str = ""):
    """
    SSE endpoint that streams text character by character
    """
    if not text:
        return {"error": "Please provide a 'text' query parameter"}
    
    async def event_stream() -> AsyncGenerator[str, None]:
        for i, char in enumerate(text):
            # Send each character with its position
            yield f"data: {json.dumps({'character': char, 'position': i + 1, 'total': len(text)})}\n\n"
            await asyncio.sleep(0.5)  # 500ms delay between characters
        
        # Send completion message
        yield f"data: {json.dumps({'message': 'Text streaming completed!', 'total_characters': len(text)})}\n\n"
    
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
