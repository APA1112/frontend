import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import ClientsPage from "./pages/ClientsPage.tsx";
import MailBoxPage from "./pages/MailBoxPage.tsx";
import WorkersPage from "./pages/WorkersPage.tsx";

const router = createBrowserRouter([{
  path: "/",
  element: <RootLayout />,
  children: [
    {index:true, element:<HomePage/>},
    { path: "clientes", element: <ClientsPage /> },
    { path: "buzón", element: <MailBoxPage /> },
    { path: "trabajadores", element: <WorkersPage /> },
  ]
},])

export default function App() {
  return <RouterProvider router={router} />
}
