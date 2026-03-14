import { HiHome } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { BsMailbox } from "react-icons/bs";
import { GrUserWorker } from "react-icons/gr";
import { NavLink as RouterNavLink } from "react-router-dom";

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

function SideBar() {
  const navLinks: NavItem[] = [
    { title: "Home", icon: HiHome, path: "/" },
    { title: "Buzón", icon: BsMailbox, path: "/buzón" },
    { title: "Clientes", icon: FaUsers, path: "/clientes" },
    { title: "Trabajadores", icon: GrUserWorker, path: "/trabajadores" },
  ];

  return (
    <aside className="h-screen w-16 md:w-[260px] bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shrink-0 z-50">
      
      {/* Header del Logo */}
      <div className="w-full flex items-center md:justify-start justify-center md:pl-6 h-[70px] border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black">
            N
          </div>
          <span className="text-slate-800 font-black text-xl md:block hidden tracking-tight">
            NNS <span className="text-orange-500">SYSTEM</span>
          </span>
        </div>
      </div>

      {/* Contenedor de Links */}
      <nav className="flex-1 flex flex-col gap-1.5 py-6 px-3">
        {navLinks.map((link) => (
          <RouterNavLink
            key={link.title}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center md:justify-start justify-center gap-3 w-full rounded-xl px-3 py-3 transition-all duration-200 group ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                  : "hover:bg-orange-50 text-slate-500 hover:text-orange-600"
              }`
            }
          >
            <link.icon size={22} className="shrink-0" />
            <span className="font-bold text-[14px] md:block hidden">
              {link.title}
            </span>
          </RouterNavLink>
        ))}
      </nav>

      {/* Botón de Logout*/}
      <div className="p-3 border-t border-slate-100">
        <button className="flex items-center md:justify-start justify-center gap-3 w-full rounded-xl px-3 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group">
          <LuLogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-bold text-[14px] md:block hidden">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default SideBar;