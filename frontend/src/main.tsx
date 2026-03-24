import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "./index.css";
import App from "@/App";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { reportWebVitals } from "@/utils/webVitals";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#66A648",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
);

reportWebVitals((metric) => {
  const color = metric.rating === "good" ? "green" : metric.rating === "needs-improvement" ? "orange" : "red";
  console.log(`%c[Web Vitals] ${metric.name}: ${metric.value}${metric.name === "CLS" ? "" : "ms"} (${metric.rating})`, `color: ${color}`);
});
