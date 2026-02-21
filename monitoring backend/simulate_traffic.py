import time
import requests
import random
from datetime import datetime

URL = "http://localhost:8000/api/ingest"

def random_success_payload():
    latency = random.randint(150, 600)
    return {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "flow_name": random.choice(["User Login", "Checkout Flow", "Search -> Product"]),
        "status": "success",
        "http_status_code": 200,
        "total_latency_ms": latency,
        "step_breakdown": [
            {"step_name": "Navigate", "latency_ms": latency * 0.3, "status": "success"},
            {"step_name": "Action", "latency_ms": latency * 0.5, "status": "success"},
            {"step_name": "Verify", "latency_ms": latency * 0.2, "status": "success"}
        ]
    }

def random_failure_payload():
    latency = random.randint(2000, 8000)
    return {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "flow_name": random.choice(["User Login", "Checkout Flow", "Search -> Product"]),
        "status": "failed",
        "http_status_code": random.choice([500, 502, 504, 404]),
        "total_latency_ms": latency,
        "step_breakdown": [
            {"step_name": "Navigate", "latency_ms": latency * 0.1, "status": "success"},
            {"step_name": "Action", "latency_ms": latency * 0.9, "status": "failed"},
        ],
        "error_type": "TimeoutError",
        "error_stack": "TimeoutError: Navigation timeout exceeded.\n  at ElementHandle.click()",
        "trace_id": f"tx-sim-{random.randint(1000,9999)}"
    }

print("Starting to stream metrics to the dashboard...")
count = 0
while True:
    count += 1
    # 90% success rate
    if random.random() < 0.9:
        payload = random_success_payload()
    else:
        payload = random_failure_payload()

    try:
        requests.post(URL, json=payload, timeout=2)
        print(f"Sent {'SUCCESS' if payload['status'] == 'success' else 'FAILED'} payload.")
    except Exception as e:
        print("Failed to send:", e)

    # Initial rapid population, then slow down
    if count < 50:
        time.sleep(0.1)
    else:
        time.sleep(3)
