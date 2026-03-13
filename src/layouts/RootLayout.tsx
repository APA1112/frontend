import {Outlet} from "react-router-dom";
import SideBar from "../components/SideBar";

export default function RootLayout() {
    return (
        <div className="flex w-full overflow-x-hidden">
            <SideBar/>
            <main className="flex-1 ml-16 md:ml-[230px] bg-slate-50 w-[calc(100%-64px)] md:w-[calc(100%-230px)] overflow-x-hidden">
                <Outlet/>
            </main>
        </div>
    );
}