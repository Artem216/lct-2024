import ImageGenerateCard from "../shared/ImageGenerateCard"
import { Button } from "../ui/button"


const GeneratedImages = () => {
    const leftSideBarWidth = 400;

    return (
        <>
            <div className="p-10 bg-light-1 rounded-2xl my-10"
                style={{ maxWidth: `calc(100% - ${leftSideBarWidth}px)`, marginLeft: `${leftSideBarWidth}px` }}>
                <div className="flex justify-between mx-5 flex-wrap gap-2">
                    <ImageGenerateCard
                        imgSrc='https://wp-s.ru/wallpapers/9/17/432090200138903/pejzazh-solnechnye-luchi-skvoz-listya-derevev-popadayut-na-ozero.jpg' />
                    <ImageGenerateCard
                        imgSrc='https://i.pinimg.com/originals/22/be/c2/22bec2bbc71f4279ecbc9b4dc837897b.jpg' />
                    <ImageGenerateCard
                        imgSrc='https://i.pinimg.com/originals/22/be/c2/22bec2bbc71f4279ecbc9b4dc837897b.jpg' />
                </div>
            </div>

        </>
    )
}

export default GeneratedImages