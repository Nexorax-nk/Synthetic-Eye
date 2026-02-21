from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import monitoring

app = FastAPI(title="Synthetic-Eye Engine")

# This allows your React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the routers
app.include_router(monitoring.router)

@app.get("/")
async def root():
    return {"message": "Synthetic-Eye Backend is running. The Ghost Customer is active."}