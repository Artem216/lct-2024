import { useGeneratorImages } from "@/context/GeneratorImagesContext";
import ImageGenerateCard from "../shared/ImageGenerateCard"
import FileUploader from "./FileUploader";

const GeneratedImages = () => {
    const leftSideBarWidth = 400;
    const { isStartGeneration, imgHeight, imgWidth, generatedImages } = useGeneratorImages();
    console.log(generatedImages, 'generatedImages')

    return (
        <>
            <div className="p-10 bg-light-1 rounded-2xl my-10"
                style={{ maxWidth: `calc(100% - ${leftSideBarWidth}px)`, marginLeft: `${leftSideBarWidth}px` }}>

                <>
                    {generatedImages &&
                        <div className="flex justify-between mx-5 flex-wrap gap-5">
                            {generatedImages.map((image) => {
                                console.log(image)
                                return (
                                    <ImageGenerateCard
                                        key={image.req_id}
                                        status={image.status}
                                        imgSrc={image.parent_s3_url ? image.parent_s3_url : ""}
                                        imgHeight={imgHeight}
                                        imgWidth={imgWidth}
                                        imgId={image.req_id}
                                    />
                                )
                            })}
                        </div>}

                </>
                <>
                    {!isStartGeneration &&
                        <FileUploader />
                    }
                </>


            </div>


        </>
    )
}

export default GeneratedImages
