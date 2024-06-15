import { useAllImages } from "@/context/AllImagesContext"
import ImageCard from "../shared/ImageCard"
import ImageCarousel from "./ImageCarousel";
import { useState } from "react";


const MyImagesWidget = () => {
  const { myCards } = useAllImages();
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="w-[95%] mx-auto p-10 bg-light-1 rounded-2xl my-10">
        <div className="flex justify-between m-10 w-[80%] mx-auto items-center">
          <p className="h3-regular md:h3-bold text-left m-5 text-dark-1">МОИ ИЗОБРАЖЕНИЯ</p>
        </div>
        <div className="flex justify-between mx-20 flex-wrap gap-10">
          {myCards.map((card) => {

            return (
              <div
                key={card.req_id}
                className="cursor-pointer"
                onClick={() => setOpenDialog(true)}
              >
                <ImageCard rating={card.rating}
                  imgPrompt={card.prompt}
                  imgSrc={card.child_s3_url}
                  imgId={card.req_id} />
              </div>
            )
          })}
        </div>
      </div>
      <ImageCarousel openCarousel={openDialog} setOpenCarousel={setOpenDialog} topImages={myCards} />

    </>
  )
}

export default MyImagesWidget