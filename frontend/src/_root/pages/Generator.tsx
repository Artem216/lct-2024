import SideBarGenerator from "@/components/widgets/SideBarGenerator"
import { GeneratorImagesProvider } from "@/context/GeneratorImagesContext"
import GeneratedImages from "@/components/widgets/GeneratedImages"

const Generator = () => {
  return (
    <>
      <GeneratorImagesProvider>
        <div className="h-full">
          <SideBarGenerator />
          <GeneratedImages />
        </div>
      </GeneratorImagesProvider>
    </>
  )
}

export default Generator