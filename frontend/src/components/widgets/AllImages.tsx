import ImageCard from "../shared/ImageCard"
import { Button } from "../ui/button"


const AllImages = () => {
  return (
    <>
      <div className="w-[90%] mx-auto p-10 bg-light-1 rounded-2xl my-10">
        <div className="flex justify-between m-10 w-[80%] mx-auto items-center">
          <p className="h3-regular md:h3-bold text-left m-5 text-dark-1">ТОП ИЗОБРАЖЕНИЙ</p>
          <Button className="shad-button_primary px-10">
            Все
          </Button>
        </div>
        <div className="flex justify-between mx-20 flex-wrap">
          <ImageCard imgPrompt="text" imgSrc='https://konvajs.org/assets/lion.png' />
        </div>
      </div>

    </>
  )
}

export default AllImages