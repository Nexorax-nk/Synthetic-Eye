from fastapi import APIRouter
from app.schemas import BotTelemetry
from app.services import metrics_engine

router = APIRouter()

@router.post("/api/ingest")
async def ingest_bot_data(payload: BotTelemetry):
    # Pass data directly to the SRE brain
    metrics_engine.record_telemetry(payload.model_dump())
    return {"status": "Telemetry processed and logged"}

@router.get("/api/dashboard/metrics")
async def get_dashboard_data():
    health = metrics_engine.get_health_metrics()
    percentiles = metrics_engine.get_latency_percentiles()
    
    return {
        "global_health": {
            "system_status": "Operational" if health["error_rate"] < 5 else "Degraded",
            "availability_pct": health["uptime"],
            "error_rate_pct": health["error_rate"],
            "total_requests": metrics_engine.total_runs,
            "active_incidents_count": len(metrics_engine.incident_logs)
        },
        "sla_error_budget": {
            "slo_target": f"p99 < {metrics_engine.SLA_LATENCY_MAX}ms & {metrics_engine.SLO_UPTIME_TARGET}% Uptime",
            "budget_remaining_pct": health["budget_remaining"]
        },
        "latency_metrics": {
            "p50_ms": percentiles["p50"],
            "p95_ms": percentiles["p95"],
            "p99_ms": percentiles["p99"],
            "max_latency_ms": percentiles["max"]
        },
        "http_status_breakdown": metrics_engine.get_status_breakdown(),
        "chart_data": metrics_engine.history[-50:], 
        "incident_panel": metrics_engine.incident_logs[:10] 
    }