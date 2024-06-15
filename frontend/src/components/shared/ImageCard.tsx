import { useState, useEffect, useRef } from 'react';
import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast";
import ImageChooseButtonDialog from './ImageChooseButtonDialog';
import { useLocation, useNavigate } from 'react-router-dom';

interface ImageCardProps {
  imgId: number;
  imgSrc: string;
  imgPrompt: string;
  rating: number;
}

const ImageCard = ({ imgSrc, imgPrompt, rating, imgId }: ImageCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const textRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [imgPrompt]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(imgPrompt)
        .then(() => {
          toast({
            title: "Промпт скопирован",
          });
        })
    }
  };

  function goToConstructor() {
    let imageType = "top";
    if(pathname === "/" || pathname === "/top-images") {
      imageType = "top"
    }
    else {
      imageType = "my"
    }
    console.log('imgId', imgId)
    navigate(`/editor/${imageType}/${imgId}`);
  }

  function goToImg2Img() {

  }

  return (
    <>
      <div className="flex flex-col justify-between w-[400px] min-h-[500px] border-[2px] border-solid border-secondary-500 rounded-[25px] mx-auto">
        <div className="drop-shadow-lg m-5 mx-auto w-[85%] relative bg-primary-500" style={{ paddingTop: '85%' }}>
          <img src={imgSrc} alt="generated image" className="absolute top-0 left-0 w-full h-full object-cover" />
        </div>
        <div className="p-3 text-dark-1 text-left">
          <div
            ref={textRef}
            onClick={copyToClipboard}
            className={`small-regular md:base-regular cursor-pointer ${isExpanded ? 'max-h-none' : 'max-h-[3em] overflow-hidden'}`}
            title="Click to copy">
            {imgPrompt}
          </div>
          {isOverflowing && (
            <button onClick={toggleExpand} className="text-primary-500 underline">
              {isExpanded ? 'Свернуть' : '...'}
            </button>
          )}
        </div>
        <div className="flex justify-between mx-10">
          <p className="small-semibold p-3 text-dark-1 text-left mb-3">
            Рейтинг: {rating}
          </p>
          <Button variant="default" className="shad-button_secondary px-5"
            onClick={() => { setOpenDialog(true) }}
          >
            Выбрать
          </Button>
        </div>
      </div>

      <ImageChooseButtonDialog
        open={openDialog}
        title={'Выберите действие'}
        description={'Вы можете перейти в конструктор и отредактировать текущее изображение, или с помощью модели сгенерировать новое изображение на основе текущего'}
        onConfirm={goToImg2Img}
        onCancel={goToConstructor}
        setOpen={setOpenDialog}
      />
    </>
  );
};

export default ImageCard;
