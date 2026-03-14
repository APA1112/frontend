import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

export default function RootLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <SideBar />
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
