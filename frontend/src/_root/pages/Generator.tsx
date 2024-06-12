import SideBarGenerator from "@/components/widgets/SideBarGenerator"
import { GeneratorParametersProvider } from "../../context/GeneratorParametersContext"

const Generator = () => {
  return (
    <>
      <GeneratorParametersProvider>
        <div className="h-full bg-primary-500">
          <SideBarGenerator />
        </div>
      </GeneratorParametersProvider>
    </>
  )
}

export default Generator