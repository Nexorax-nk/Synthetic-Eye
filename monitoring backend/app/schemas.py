from pydantic import BaseModel
from typing import Optional, List

# 1. Tracks individual steps (e.g., Login -> Cart -> Checkout)
class StepMetric(BaseModel):
    step_name: str
    latency_ms: float
    status: str

# 2. The main payload the bot sends after every run
class BotTelemetry(BaseModel):
    timestamp: str               
    flow_name: str               
    status: str                  # "success" or "failed"
    http_status_code: int        # e.g., 200, 404, 500, 504
    total_latency_ms: float
    step_breakdown: List[StepMetric] 
    error_type: Optional[str] = None      
    error_stack: Optional[str] = None    
    screenshot_base64: Optional[str] = None