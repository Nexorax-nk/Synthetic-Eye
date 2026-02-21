from fastapi import APIRouter, Request
import asyncio

router = APIRouter()

@router.post("/api/checkout")
async def process_checkout(request: Request):
    # THE KILL SWITCH: Pass 'x-kill-switch: true' in Postman headers to freeze it
    if request.headers.get("x-kill-switch") == "true":
        await asyncio.sleep(10) # Intentional 10-second freeze
        
    return {"status": "success", "message": "Order processed perfectly."}