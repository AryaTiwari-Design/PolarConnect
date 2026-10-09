import React from "react";
import { createRoot } from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminPage from "./pages/AdminPage";
import ChatPage from "./pages/ChatPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ResearchPage from "./pages/ResearchPage";
import AcademyPage from "./modules/education/AcademyPage";
import MapPage from "./modules/map/MapPage";
import "./styles.css";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/research", element: <ResearchPage /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/map", element: <MapPage /> },
      { path: "/academy", element: <AcademyPage /> },
      {
        path: "/admin",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
