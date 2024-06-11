import ImageCard from "../shared/ImageCard"
import { Button } from "../ui/button"


const AllImages = () => {
  return (
    <>
      <div className="w-[95%] mx-auto p-10 bg-light-1 rounded-2xl my-10">
        <div className="flex justify-between m-10 w-[80%] mx-auto items-center">
          <p className="h3-regular md:h3-bold text-left m-5 text-dark-1">ТОП ИЗОБРАЖЕНИЙ</p>
          <Button className="shad-button_primary px-10">
            Все
          </Button>
        </div>
        <div className="flex justify-between mx-20 flex-wrap gap-5">
          <ImageCard rating={10}
          imgPrompt="text https://wp-s.ru/wallpapers/9/17/432090200138903/pejzazh-solnechnye-luchi-skvoz-listya-derevev-popadayut-na-ozero.jpg" 
          imgSrc='https://wp-s.ru/wallpapers/9/17/432090200138903/pejzazh-solnechnye-luchi-skvoz-listya-derevev-popadayut-na-ozero.jpg' />
          <ImageCard imgPrompt="text" rating={10}
          imgSrc='https://i.pinimg.com/originals/22/be/c2/22bec2bbc71f4279ecbc9b4dc837897b.jpg' />
          <ImageCard imgPrompt="text" rating={10}
          imgSrc='https://konvajs.org/assets/lion.png' />
        </div>
      </div>

    </>
  )
}

export default AllImages