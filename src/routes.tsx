import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import Calendar from "./pages/Calendar";
import Layout from "./components/Layout";
import InDevelopment from "./pages/InDevelopment";
import type { IconName } from "./components/Icon";
import type { ReactElement } from "react";

type NavItem = {
  path: string;
  label: string;
  element: ReactElement;
  icon: IconName;
};

export const navItems: NavItem[] = [
  {
    path: "",
    label: "Home",
    element: <Home />,
    icon: "house",
  },
  {
    path: "dashboard",
    label: "Dashboard",
    element: <InDevelopment />,
    icon: "dashboard",
  },
  {
    path: "inbox",
    label: "Inbox",
    element: <InDevelopment />,
    icon: "mail",
  },
  {
    path: "products",
    label: "Products",
    element: <InDevelopment />,
    icon: "barcode",
  },
  {
    path: "invoices",
    label: "Invoices",
    element: <InDevelopment />,
    icon: "receipt",
  },
  {
    path: "customers",
    label: "Customers",
    element: <InDevelopment />,
    icon: "user",
  },
  {
    path: "chat-room",
    label: "Chat Room",
    element: <InDevelopment />,
    icon: "messages",
  },
  {
    path: "calendar",
    label: "Calendar",
    element: <Calendar />,
    icon: "calendar",
  },
  {
    path: "help-center",
    label: "Help Center",
    element: <InDevelopment />,
    icon: "help",
  },
  {
    path: "settings",
    label: "Settings",
    element: <InDevelopment />,
    icon: "settings",
  },
];

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <Page404 />,
      children: navItems.map(({ path, element }) => ({
        index: path.length === 0,
        path,
        element,
      })),
    },
  ],
  {
    basename: "/dashboard/",
  },
);
