import { useImageConstructor } from "@/context/imageConstructorContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


interface CanvasSideBarProps {
    handleClick: () => void;
}


const CanvasSideBar = ({ handleClick }: CanvasSideBarProps) => {
    const { setColor, color, setHeight, height, setText, text, setWidth, width } = useImageConstructor();

    return (
        <>
            <div className="bg-primary-500/10 w-[400px] rounded-[20px] text-black
            h-[500px] my-8 p-5">
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
                <Button onClick={handleClick} className="shad-button_primary px-[15%]">
                    Скачать
                </Button>
            </div>
        </>
    )
}

export default CanvasSideBar