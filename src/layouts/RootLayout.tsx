// layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

export default function RootLayout() {
  return (
    <div className="flex">
      <SideBar />
      {/* Margen izquierdo igual al ancho de tu Sidebar (md:w-230px) */}
      <main className="flex-1 md:ml-[230px] ml-[60px] bg-slate-50 min-h-screen">
        <Outlet /> 
      </main>
    </div>
  );
}