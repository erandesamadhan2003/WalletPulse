import { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { Navbar } from "./Navbar";
import { SideMenu } from "./SideMenu.jsx";

export const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="">
            <Navbar activeMenu={activeMenu} />

            {user &&
                <div className="flex">
                    <div className="">
                        {/* <SideMenu activeMenu={activeMenu} /> */}
                    </div>
                    <div className="grow mx-5">{children}</div>
                </div>
            }
        </div>
    )
}