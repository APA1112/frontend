import { HiHome } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { BsMailbox } from "react-icons/bs";
import { GrUserWorker } from "react-icons/gr";
import { NavLink } from "react-router-dom";

// Definimos la interfaz
interface NavLink {
  title: string;
  icon: React.ReactNode;
  active: boolean;
}

function SideBar() {
  const navLinks: NavLink[] = [
    {
      title: "Home",
      icon: <HiHome size={22} color="#555" />,
      active: false,
    },
    {
      title: "Buzón",
      icon: <BsMailbox size={22} color="#555" />,
      active: false,
    },
    {
      title: "Clientes",
      icon: <FaUsers size={22} color="#555" />,
      active: false,
    },
    {
      title: "Trabajadores",
      icon: <GrUserWorker size={22} color="#555" />,
      active: false,
    },
  ];

  return (
    <div className="fixed left-0 top-0 w-16 md:w-[230px] overflow-hidden h-full flex flex-col transition-all duration-300">
      
      {/* Header del Logo */}
      <div className="w-full flex items-center md:justify-start justify-center md:pl-5 h-[70px]">
        <span className="text-orange-400 font-semibold text-2xl md:block hidden cursor-pointer">
          NNS
        </span>
        <span className="text-orange-400 font-semibold text-2xl md:hidden block cursor-pointer">
          N.
        </span>
      </div>

      {/* Contenedor de Links */}
      <div className="w-full h-full flex flex-col items-center md:items-start gap-2 py-5 px-3 relative">
        {navLinks.map((link) => (
          <NavLink
            key={link.title}
            to={link.title === "Home" ? "/" : `/${link.title.toLowerCase()}`}
            className={({ isActive }) =>
              `flex items-center md:justify-start justify-center gap-2 w-full rounded-lg px-2 py-3 transition-colors ${
                isActive
                  ? "bg-orange-300 text-white"
                  : "hover:bg-orange-100 text-slate-600"
              }`
            }
          >
            {link.icon}
            <span className="font-medium text-[15px] md:block hidden">
              {link.title}
            </span>
          </NavLink>
        ))}

        {/* Botón de Logout */}
        <div className="flex absolute bottom-4 items-center md:justify-start justify-center gap-2 w-[calc(100%-24px)] rounded-lg hover:bg-orange-100 px-2 py-3 cursor-pointer text-slate-600">
          <LuLogOut size={22} />
          <span className="font-medium text-[15px] md:block hidden">Log Out</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
