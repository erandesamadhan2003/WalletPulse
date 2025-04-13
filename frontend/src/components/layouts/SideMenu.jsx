import { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { useNavigate } from 'react-router-dom'
import { SIDE_MENU_DATA } from "../../utils/data";

export const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/login')
    }
    const handleClick = (route) => {
        if (route === 'logout') {
            handleLogout();
            return;
        }

        navigate(route);
    }

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
            <div className="flex flex-col items-center justify-center gap-3 mb-7">

                <img
                    src="https://i.pinimg.com/736x/e0/99/6a/e0996abf2cc49d103bd7c5b8c6feed8d.jpg"
                    alt="expense Image"
                    className="w-56 h-48 rounded-full"
                />

                <h5 className="text-gray-950 font-medium leading-6">
                    {user?.fullname || ""}
                </h5>
            </div>
            {SIDE_MENU_DATA.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] ${
                        activeMenu == item.label ? "text-white bg-purple-700 " : ""
                    } py-3 px-6 rounded-lg mb-3`}
                >
                    <item.icon className="text-xl" />
                    {item.label}
                </button>
            ))}
        </div>
    )
}   