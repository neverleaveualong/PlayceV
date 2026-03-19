import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import useAuthStore from "@/stores/authStore";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "@/components/common/Toast";

const PasswordResetModal = lazy(
  () => import("@/components/auth/PasswordResetModal")
);

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn) {
      queryClient.removeQueries({ queryKey: ["favorites"] });
    }
  }, [isLoggedIn, queryClient]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <main className="min-h-screen bg-gray-50 font-sans relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/reset-password/:token"
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-screen"><LoadingSpinner /></div>}>
                  <PasswordResetModal />
                </Suspense>
              }
            />
          </Routes>
          <Toast />
        </main>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
