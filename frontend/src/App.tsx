import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PasswordResetModal from "@/components/auth/PasswordResetModal";
import useAuthStore from "@/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "@/components/common/Toast";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn) {
      queryClient.removeQueries({ queryKey: ["favorites"] });
    }
  }, [isLoggedIn, queryClient]);

  return (
    <BrowserRouter>
      <main className="min-h-screen bg-gray-50 font-sans relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/reset-password/:token"
            element={<PasswordResetModal />}
          />
        </Routes>
        <Toast />
      </main>
    </BrowserRouter>
  );
}

export default App;
