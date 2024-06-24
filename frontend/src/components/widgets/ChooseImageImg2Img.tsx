import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useImg2Img } from "@/context/Img2ImgContext";

const ChooseImageImg2Img = () => {
  const topBarHeight = 60;
  const { handleImgFileUpload, fileImg, setImgFile, imgSrc, setImgSrc } = useImg2Img();
  const navigate = useNavigate();


  function handleDelete(){
    setImgFile(null)
    setImgSrc(null)
    navigate("/image2image/new/0")
  }

  return (
    <div className="text-black w-[400px] flex items-center justify-center flex-col
    absolute"
      style={{ minHeight: `calc(100vh - ${topBarHeight}px)` }}>
      <div className="mt-[-100px] mb-5">
        ГЕНЕРАЦИЯ НА ОСНОВЕ ИЗОБРАЖЕНИЯ
      </div>
      {!imgSrc &&
        <div className="flex gap-10 flex-col border border-secondary-500
      p-[50px] rounded-tr-[15px] rounded-tl-[50px] rounded-bl-[15px] rounded-br-[50px]
     drop-shadow-lg mt-[50px]">
          <div className="text-black text-center">
            Загрузите исходное изображение с устройства или выберите из Топа изображений
          </div>
          <div className="flex gap-10 flex-col w-[100%]">
            <div className="w-[100%]">
              <label htmlFor="file-upload" className="w-[100%] shad-button_secondary py-2 px-[50px] cursor-pointer
                                rounded-tr-[15px] rounded-tl-[50px] rounded-bl-[15px] rounded-br-[50px] h-10 text-center">
                Загрузить изображение
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                className="hidden"
                onChange={handleImgFileUpload}
              />
            </div>
            <div>
              <Link to={"/my-images"}>
                <Button className="shad-button_primary px-10 w-full">
                  Перейти к моим изображениям
                </Button>
              </Link>
            </div>
            <div>
              <Link to={"/top-images"}>
                <Button className="shad-button_primary px-10 w-full">
                  Перейти к Топу изображений
                </Button>
              </Link>
            </div>
          </div>
        </div>}
      {imgSrc &&
        <div>
          <img src={imgSrc} alt="Uploaded Image" className="border border-secondary-500 p-7 rounded-lg" />
          <div className="flex justify-end">
            <Button className="shad-button_primary px-10 w-[50%] mt-2"
            onClick={handleDelete}>
              Удалить
            </Button>
          </div>
        </div>
      }
    </div>

  )
}

export default ChooseImageImg2Img