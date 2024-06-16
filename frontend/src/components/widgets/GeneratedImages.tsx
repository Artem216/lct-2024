import { useGeneratorImages } from "@/context/GeneratorImagesContext";
import ImageGenerateCard from "../shared/ImageGenerateCard"


const GeneratedImages = () => {
    const leftSideBarWidth = 400;
    const { isStartGeneration, imgHeight, imgWidth, generatedImages } = useGeneratorImages();

    return (
        <>
            <div className="p-10 bg-light-1 rounded-2xl my-10"
                style={{ maxWidth: `calc(100% - ${leftSideBarWidth}px)`, marginLeft: `${leftSideBarWidth}px` }}>
                {isStartGeneration &&
                    <>
                        <div className="flex justify-between mx-5 flex-wrap gap-5">
                            {generatedImages.map((image) => {
                                console.log(image)
                                return (
                                    <ImageGenerateCard
                                        key={image.req_id}
                                        status={image.status}
                                        imgSrc={image.child_s3_url ? image.child_s3_url : ""}
                                        imgHeight={imgHeight}
                                        imgWidth={imgWidth}
                                        imgId={image.req_id}
                                    />
                                )
                            })}
                        </div>

                    </>
                }

            </div>

        </>
    )
}

export default GeneratedImages