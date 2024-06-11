import { Link, useLocation, useNavigate } from "react-router-dom"
import logo_text from "../../assets/gazprom_fill_logo_text.svg"
import { Button } from "../ui/button"
import storage from "@/lib/storage"
import { topbarLinks } from "@/constants"

const TopBar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function signOut() {
        storage.clearAll();
        navigate("/sign-in");
    }

    return (
        <>
            <div className="flex justify-between px-10">
                <Link to='/' className="flex gap-3 items-center">
                    <img src={logo_text} alt="logo" width={150} />
                </Link>
                <div className="flex gap-5">
                    {topbarLinks.map((link) => {
                        const isActive = pathname === link.route;

                        return (
                            <Link to={link.route}
                                key={link.label}
                                className={`flex-center flex-col gap-1 p-2 transition `}>
                                <p className={`${isActive && 'underline'}  small-medium text-black`}>{link.label}</p>
                            </Link>
                        )
                    })}
                </div>
                <Button variant="default" className="shad-button_secondary px-5"
                    onClick={() => signOut()}>
                    Выйти
                </Button>
            </div>
        </>
    )
}

export default TopBar