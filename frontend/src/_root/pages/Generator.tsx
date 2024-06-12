import SideBarGenerator from "@/components/widgets/SideBarGenerator"
import { GeneratorParametersProvider } from "../../context/GeneratorParametersContext"
import GeneratedImages from "@/components/widgets/GeneratedImages"

const Generator = () => {
  return (
    <>
      <GeneratorParametersProvider>
        <div className="h-full">
          <SideBarGenerator />
          <GeneratedImages />
        </div>
      </GeneratorParametersProvider>
    </>
  )
}

export default Generator