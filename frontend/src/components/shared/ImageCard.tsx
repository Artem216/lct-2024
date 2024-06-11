

interface ImageCardProps {
  imgSrc: string;
  imgPrompt: string;
}

const ImageCard = ({ imgSrc, imgPrompt }: ImageCardProps) => {

  return (
    <>
      <div className={`flex-col justify-between`}>
        <div style={{ backgroundColor: "white" }} className="rounded-2xl drop-shadow-lg  w-[200px] h-[200px]">
          <img src={imgSrc} alt="generated image" />
        </div>
        <p className="my-2 text-primary-500 body-bold text-center">{imgPrompt}</p>
      </div>
    </>
  )
}

export default ImageCard