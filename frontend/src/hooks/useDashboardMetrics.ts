import { useState, useEffect, useCallback } from "react";
import type { DashboardMetrics } from "@/types/dashboard";
import { generateMockMetrics } from "@/lib/mockData";

const API_URL = "http://localhost:8000/api/dashboard/metrics";
const POLL_INTERVAL = 4000;

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(generateMockMetrics());
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMetrics(data);
      setIsLive(true);
      setError(null);
    } catch {
      // Fallback to mock data with slight randomization
      setMetrics(generateMockMetrics());
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return { metrics, isLive, error };
}
