import statistics
import random
from datetime import datetime

# --- SRE IN-MEMORY DATABASE ---
history = []          # Time-series data for the graph
incident_logs = []    # Stores the full Incident details and screenshots
total_runs = 0
successful_runs = 0

# HTTP Status Tracker
status_codes = {"200": 0, "400": 0, "500": 0, "504": 0}

# SRE Targets
SLO_UPTIME_TARGET = 99.0
SLA_LATENCY_MAX = 2000.0

def generate_incident_id():
    return f"INC-{random.randint(1000, 9999)}"

def record_telemetry(payload: dict):
    global total_runs, successful_runs
    total_runs += 1
    
    # 1. Track HTTP Status Codes
    code = str(payload["http_status_code"])
    status_codes[code] = status_codes.get(code, 0) + 1

    # 2. Process Success vs Failure
    if payload["status"] == "success":
        successful_runs += 1
    else:
        # Generate Enterprise Incident Data
        payload["incident_id"] = generate_incident_id()
        payload["severity"] = "High" if payload["total_latency_ms"] > SLA_LATENCY_MAX else "Medium"
        incident_logs.insert(0, payload)

    # 3. Save Time-Series Data for the Graph
    history.append({
        "time": payload["timestamp"],
        "latency": payload["total_latency_ms"],
        "status": payload["status"]
    })
    
    if len(history) > 1000:
        history.pop(0)

def get_health_metrics():
    if total_runs == 0: 
        return {"uptime": 100.0, "error_rate": 0.0, "budget_remaining": 100.0}
    
    uptime = (successful_runs / total_runs) * 100
    error_rate = 100.0 - uptime
    
    # Error Budget Calculation
    if uptime >= SLO_UPTIME_TARGET:
        budget = 100.0
    else:
        budget = max(0.0, (uptime / SLO_UPTIME_TARGET) * 100)
        
    return {
        "uptime": round(uptime, 2),
        "error_rate": round(error_rate, 2),
        "budget_remaining": round(budget, 1)
    }

def get_latency_percentiles():
    latencies = [run["latency"] for run in history if run["status"] == "success"]
    if len(latencies) < 2:
        return {"p50": 0, "p95": 0, "p99": 0, "max": 0}
        
    q = statistics.quantiles(latencies, n=100)
    return {
        "p50": round(q[49], 2),
        "p95": round(q[94], 2),
        "p99": round(q[98], 2),
        "max": round(max(latencies), 2)
    }

def get_status_breakdown():
    if total_runs == 0: return {}
    return {code: round((count/total_runs)*100, 1) for code, count in status_codes.items() if count > 0}