import SideBarGenerator from "@/components/widgets/SideBarGenerator"
import { GeneratorImagesProvider } from "@/context/GeneratorImagesContext"
import GeneratedImages from "@/components/widgets/GeneratedImages"
import { FileUploaderProvider } from "@/context/FileUploaderContext"

const Generator = () => {
  return (
    <>
      <GeneratorImagesProvider>
        <FileUploaderProvider>
          <div className="h-full">
            <SideBarGenerator />
            <GeneratedImages />
          </div>
        </FileUploaderProvider>
      </GeneratorImagesProvider>
    </>
  )
}

export default Generator