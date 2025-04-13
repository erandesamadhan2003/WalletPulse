import { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { Navbar } from "./Navbar";
import { SideMenu } from "./SideMenu.jsx";

export const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);

    return (
        <div>
            <Navbar activeMenu={activeMenu} />

            {user &&
                <div className="flex">
                    <div className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-md z-40">
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    <div className="grow mx-5 w-full lg:ml-72">
                        {children}
                    </div>
                </div>
            }
        </div>
    )
}
