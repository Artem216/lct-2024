import { Outlet, Navigate } from "react-router-dom"
import bg_img from "../assets/bg_pictures.png"
import logo_text from "../assets/gazprom_fill_logo_text.svg"

const AuthLayout = () => {
  const isAuth = false;

  return (
    <>
      {isAuth ? (
        <Navigate to="/" />
      ) : (
        <>
          <div className="absolute top-5 left-5">
            <img src={logo_text} alt="logo" width={210}/>
          </div>
          <section className="bg-light-2 flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
          <img src={bg_img}
            alt="logo"
            className="bg-light-2 md:block hidden h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  )
}

export default AuthLayout