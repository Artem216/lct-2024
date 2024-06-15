import { useAllImages } from "@/context/AllImagesContext"
import ImageCard from "@/components/shared/ImageCard";
import ApiImage, { IResponseCard } from "@/services/apiImage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { categoryToTitle } from "@/constants";

const AllImagesCategory = () => {
  const [images, setImages] = useState<IResponseCard[]>();
  const { category } = useParams();


  useEffect(() => {
    async function fetchImageStatus(category: string) {
        try {
            const imageCards = await ApiImage.getCardsByCategory(category);
            console.log('imageCards', imageCards)
            if(imageCards) setImages(imageCards)
        } catch (error) {
            console.log(error)
        }
    }
    if(category) fetchImageStatus(category)
  }, [])

  return (
    <>
      <div className="w-[95%] mx-auto p-10 bg-light-1 rounded-2xl my-10">
        <div className="flex justify-between m-10 w-[80%] mx-auto items-center">
          {category && <p className="h3-regular md:h3-bold text-left m-5 text-dark-1">ИЗОБРАЖЕНИЯ в категории {categoryToTitle[category]}</p>}
        </div>
        <div className="flex justify-between mx-20 flex-wrap gap-10">
          {images && images.map((card) => {

            return (
              <ImageCard rating={card.rating}
                imgPrompt={card.prompt}
                imgSrc={card.child_s3_url} 
                imgId={card.id}/>
            )
          })}
        </div>
      </div>

    </>
  )
}

export default AllImagesCategory