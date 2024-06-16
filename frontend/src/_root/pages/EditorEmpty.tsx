import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"


const EditorEmpty = () => {
  return (
    <div className="h-[800px] w-full flex items-center justify-around px-[500px]">
      <div className="flex gap-10 flex-col border p-[50px] rounded-tr-[15px] rounded-tl-[50px] rounded-bl-[15px] rounded-br-[50px]
      drop-shadow-lg">
        <div className="text-black text-center">
          Для перехода к редактору изображений вам нужно выбрать изображение <br></br>из Топа, из моих изображений,<br></br>
          или можете перейти в конструтор сразу после генерации
        </div>
        <div className="flex gap-10">
          <div>
            <Link to={"/top-images"}>
              <Button className="shad-button_primary px-10">
                Перейти к Топу изображений
              </Button>
            </Link>
          </div>
          <div>
            <Link to={"/my-images"}>
              <Button className="shad-button_primary px-10">
                Перейти к моим изображениям
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorEmpty