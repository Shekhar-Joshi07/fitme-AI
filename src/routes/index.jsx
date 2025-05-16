import { createBrowserRouter, Navigate } from "react-router-dom";
import UserDetails from "../components/UserDetails";
import Chat from "../pages/Chat";
import Layout from "../components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/onboarding" />,
      },
      {
        path: "onboarding",
        element: <UserDetails />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
]);

export default router; 