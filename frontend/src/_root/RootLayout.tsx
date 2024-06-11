import { Outlet } from "react-router-dom"
import TopBar from "@/components/widgets/TopBar"

const RootLayout = () => {
  return (
    <div className="w-full p-3">
      <TopBar />
      {/* <LeftSideBar /> */}

      <section className="w-full">
        <Outlet />
      </section>

      {/* <BottomBar /> */}
    </div>
  )
}

export default RootLayout