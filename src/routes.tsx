import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { ProtectedRoute as AuthGuard } from "@/components/layout/ProtectedRoute";

const LandingPage = React.lazy(() => import("@/pages/Landing").then((module) => ({ default: module.LandingPage })));
const LoginPage = React.lazy(() => import("@/pages/auth/Login").then((module) => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import("@/pages/auth/Register").then((module) => ({ default: module.RegisterPage })));
const DashboardPage = React.lazy(() => import("@/pages/Dashboard").then((module) => ({ default: module.DashboardPage })));
const PostItemPage = React.lazy(() => import("@/pages/PostItem").then((module) => ({ default: module.PostItemPage })));
const ItemDetailPage = React.lazy(() => import("@/pages/ItemDetail").then((module) => ({ default: module.ItemDetailPage })));
const MyItemsPage = React.lazy(() => import("@/pages/MyItems").then((module) => ({ default: module.MyItemsPage })));
const SettingsPage = React.lazy(() => import("@/pages/Settings").then((module) => ({ default: module.SettingsPage })));
const CampusRegisterPage = React.lazy(() => import("@/pages/CampusRegister").then((module) => ({ default: module.CampusRegisterPage })));
const CampusStatsPage = React.lazy(() => import("@/pages/CampusStats").then((module) => ({ default: module.CampusStatsPage })));
const NotFoundPage = React.lazy(() => import("@/pages/NotFound").then((module) => ({ default: module.NotFoundPage })));
const PrivacyPage = React.lazy(() => import("@/pages/Privacy").then((module) => ({ default: module.PrivacyPage })));
const TermsPage = React.lazy(() => import("@/pages/Terms").then((module) => ({ default: module.TermsPage })));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "auth/login",
        element: <LoginPage />,
      },
      {
        path: "auth/register",
        element: <RegisterPage />,
      },
      {
        path: "campuses/register",
        element: <CampusRegisterPage />,
      },
      {
        path: "c/:slug/stats",
        element: <CampusStatsPage />,
      },
      {
        element: <AuthGuard />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "post",
            element: <PostItemPage />,
          },
          {
            path: "item/:id",
            element: <ItemDetailPage />,
          },
          {
            path: "my-items",
            element: <MyItemsPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
      {
        path: "terms",
        element: <TermsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
