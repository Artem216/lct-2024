import { useAllImages } from "@/context/AllImagesContext"
import ImageCard from "../shared/ImageCard"
import ImageCarousel from "./ImageCarousel";
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const MyImagesWidget = () => {
  const { myCards } = useAllImages();
  const [openDialog, setOpenDialog] = useState(false);

  const downloadImages = async () => {
    const zip = new JSZip();

    const imagePromises = myCards.map(async (card, index) => {
      const response = await axios.get(card.parent_s3_url, { responseType: 'blob' });
      zip.file(`Изображение${index + 1}.jpg`, response.data);
    });

    await Promise.all(imagePromises);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'Сгенерированные_изображения.zip');
  };

  return (
    <>
      <div className="w-[95%] mx-auto p-10 bg-light-1 rounded-2xl my-10">
        <div className="flex justify-between m-10 w-[80%] mx-auto items-center">
          <p className="h3-regular md:h3-bold text-left m-5 text-dark-1">МОИ ИЗОБРАЖЕНИЯ</p>
          <Button className="shad-button_primary px-5 w-[200px]" onClick={downloadImages}>
              Скачать изображения
            </Button>
        </div>
        <div className="flex justify-between mx-20 flex-wrap gap-10">
          {myCards.map((card) => {

            return (
              <ImageCard rating={card.rating}
                imgPrompt={card.prompt}
                imgSrc={card.child_s3_url}
                imgId={card.req_id}
                setOpenCarouselDialog={setOpenDialog}
              />
            )
          })}
        </div>
      </div>
      <ImageCarousel openCarousel={openDialog} setOpenCarousel={setOpenDialog} topImages={myCards} />

    </>
  )
}

export default MyImagesWidget