type Metric = {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
};

type ReportHandler = (metric: Metric) => void;

const thresholds: Record<string, [number, number]> = {
  CLS: [0.1, 0.25],
  FID: [100, 300],
  LCP: [2500, 4000],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
  INP: [200, 500],
};

function getRating(name: string, value: number): Metric["rating"] {
  const t = thresholds[name];
  if (!t) return "good";
  if (value <= t[0]) return "good";
  if (value <= t[1]) return "needs-improvement";
  return "poor";
}

function createMetric(name: string, value: number): Metric {
  return { name, value: Math.round(value), rating: getRating(name, value) };
}

export function reportWebVitals(onReport: ReportHandler) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  // LCP
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) onReport(createMetric("LCP", last.startTime));
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch { /* unsupported */ }

  // FID
  try {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEventTiming;
        onReport(createMetric("FID", e.processingStart - e.startTime));
      }
    });
    fidObserver.observe({ type: "first-input", buffered: true });
  } catch { /* unsupported */ }

  // CLS
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!e.hadRecentInput && e.value) {
          clsValue += e.value;
        }
      }
      onReport(createMetric("CLS", clsValue));
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
  } catch { /* unsupported */ }

  // FCP
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          onReport(createMetric("FCP", entry.startTime));
        }
      }
    });
    fcpObserver.observe({ type: "paint", buffered: true });
  } catch { /* unsupported */ }

  // TTFB
  try {
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (navEntries.length > 0) {
      onReport(createMetric("TTFB", navEntries[0].responseStart));
    }
  } catch { /* unsupported */ }
}
