import { ReactNode } from "react";
import DashboardNavbar from "./components/Navbar";

export default function DashbaordLayout({children} : {children: ReactNode}){
    return(
        <div>
            <DashboardNavbar/>
            {children}
        </div>
    )
}