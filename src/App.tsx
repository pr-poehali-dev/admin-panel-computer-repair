import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminLayout } from "@/components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Clients from "./pages/Clients";
import Devices from "./pages/Devices";
import Repairs from "./pages/Repairs";
import Parts from "./pages/Parts";
import Warehouse from "./pages/Warehouse";
import Staff from "./pages/Staff";
import Services from "./pages/Services";
import Finances from "./pages/Finances";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/clients" element={<ProtectedRoute><AdminLayout><Clients /></AdminLayout></ProtectedRoute>} />
      <Route path="/devices" element={<ProtectedRoute><AdminLayout><Devices /></AdminLayout></ProtectedRoute>} />
      <Route path="/repairs" element={<ProtectedRoute><AdminLayout><Repairs /></AdminLayout></ProtectedRoute>} />
      <Route path="/parts" element={<ProtectedRoute><AdminLayout><Parts /></AdminLayout></ProtectedRoute>} />
      <Route path="/warehouse" element={<ProtectedRoute><AdminLayout><Warehouse /></AdminLayout></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute><AdminLayout><Staff /></AdminLayout></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><AdminLayout><Services /></AdminLayout></ProtectedRoute>} />
      <Route path="/finances" element={<ProtectedRoute><AdminLayout><Finances /></AdminLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><AdminLayout><Reports /></AdminLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AdminLayout><Analytics /></AdminLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><AdminLayout><Notifications /></AdminLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;