import { useAllImages } from "@/context/AllImagesContext"
import ImageCard from "../shared/ImageCard"
import { Button } from "../ui/button"
import { Link } from "react-router-dom";


const AllImages = () => {
  const { topNCards } = useAllImages();
  return (
    <>
      <div className="w-[95%] mx-auto p-10 bg-light-1 rounded-2xl my-10">
        <div className="flex justify-between m-10 w-[80%] mx-auto items-center">
          <p className="h3-regular md:h3-bold text-left m-5 text-dark-1">ТОП ИЗОБРАЖЕНИЙ</p>
          <Link to={"/top-images"}>
            <Button className="shad-button_primary px-10">
              Все
            </Button>
          </Link>
        </div>
        <div className="flex justify-between mx-20 flex-wrap gap-5">
          {topNCards.map((card) => {
            return (
              <ImageCard rating={card.rating}
                imgPrompt={card.prompt}
                imgSrc={card.child_s3_url} />
            )
          })}
        </div>
      </div>

    </>
  )
}

export default AllImages