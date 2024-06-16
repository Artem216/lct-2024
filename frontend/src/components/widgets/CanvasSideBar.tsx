import { useImageConstructor } from "@/context/imageConstructorContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import IconButton from "../shared/IconButton";
import repeat_path from '../../assets/repeat.png';



interface CanvasSideBarProps {
    handleClick: () => void;
    handleAddText: (text: string) => void;
    handleRemoveAllTexts: () => void;
}


const CanvasSideBar = ({ handleClick, handleAddText, handleRemoveAllTexts }: CanvasSideBarProps) => {
    const { setColor, color, setHeight, height, setText, text,
        setWidth, width, fontSize, setFontSize, colorText, setColorText, setUndo } = useImageConstructor();

    return (
        <>
            <div className="bg-primary-500/10 w-[400px] rounded-[20px] text-black
            min-h-[500px] my-8 p-5">
                <p className="base-regular md:base-regular text-left text-black m-2 mt-5">
                    Параметры редактора
                </p>
                <div className="flex items-center">
                    <div className="flex items-center gap-2">
                        <input
                            className="ml-5"
                            type="color"
                            value={color}
                            onChange={(e) => { setColor(e.target.value) }}
                            style={{ cursor: 'pointer', width: '60px', height: '40px' }}
                        />
                        <label
                            className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Цвет фона
                        </label>
                    </div>
                    <div className="w-[140px] mx-8 my-5">
                        <div className="mb-2">
                            <label
                                className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Высота
                            </label>
                            <div className="flex items-center">
                                <Input className="shad-input text-black mt-3" type="number"
                                    value={height} onChange={(e) => { setHeight(Number(e.target.value)) }} />
                                <p className="text-black ml-2">px</p>
                            </div>
                        </div>
                        <div>
                            <label
                                className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Ширина
                            </label>
                            <div className="flex items-center">
                                <Input className="shad-input text-black mt-3" type="number"
                                    value={width} onChange={(e) => { setWidth(Number(e.target.value)) }} />
                                <p className="text-black ml-2">px</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-10">
                    <label className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Добавить текст
                    </label>
                    <div className="mb-2 mt-2">
                        <Textarea
                            className="p-4 text-black min-h-[100px]"
                            value={text}
                            onChange={(e) => { setText(e.target.value) }}
                        />
                    </div>
                    <div className="flex justify-between items-center my-2">
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center">
                                <Input className="shad-input text-black w-[100px]" type="number"
                                    value={fontSize} onChange={(e) => { setFontSize(Number(e.target.value)) }} />
                                <p className="text-black ml-2">px</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    className="ml-5"
                                    type="color"
                                    value={colorText}
                                    onChange={(e) => { setColorText(e.target.value) }}
                                    style={{ cursor: 'pointer', width: '60px', height: '40px' }}
                                />
                                <label
                                    className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Цвет текста
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                        <Button onClick={() => {
                                handleRemoveAllTexts()
                            }} className="bg-slate border-[3px] px-5">
                                Удалить текст
                            </Button>
                            <Button onClick={() => {
                                if (text.length > 0) {
                                    handleAddText(text)
                                }
                            }} className="shad-button_secondary px-5">
                                Добавить текст
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="flex items-center gap-2">
                        <IconButton
                            iconSrc={repeat_path}
                            borderColor='white'
                            altText="Edit"
                            onClick={() => {
                                handleRemoveAllTexts();
                                setUndo(true);
                            }}
                        />
                        <label
                            className="text-sm text-black
                            font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Отменить изменения
                        </label>
                    </div>
                    <Button onClick={handleClick} className="shad-button_primary px-[15%] my-5">
                        Скачать
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CanvasSideBar