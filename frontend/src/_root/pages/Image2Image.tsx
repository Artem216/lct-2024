import SideBarImg2Img from "@/components/widgets/SideBarImg2Img"
import { GeneratorImagesProvider } from "@/context/GeneratorImagesContext"
import GeneratedImages from "@/components/widgets/GeneratedImages"
import { FileUploaderProvider } from "@/context/FileUploaderContext"
import ChooseImageImg2Img from "@/components/widgets/ChooseImageImg2Img"

const Generator = () => {
    const leftSideBarWidth = 400;
    const topBarHeight = 60;

    return (
        <>
            <GeneratorImagesProvider>
                <FileUploaderProvider>
                        <div className="h-full">
                            <SideBarImg2Img />
                            <div className="flex gap-5"
                            style={{
                                maxWidth: `calc(100% - ${leftSideBarWidth}px)`, marginLeft: `${leftSideBarWidth + 50}px`,
                                minHeight: `calc(100vh - ${topBarHeight}px)`
                            }}>
                                <ChooseImageImg2Img />
                                <GeneratedImages />
                            </div>
                        </div>
                </FileUploaderProvider>
            </GeneratorImagesProvider>
        </>
    )
}

export default Generator