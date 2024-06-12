import { useEffect, useState } from "react";
import GeneratorSelect from "../shared/GeneratorSelect";
import { useGeneratorParameters, GeneratorParametersState } from "@/context/GeneratorParametersContext";
import { Button } from "../ui/button";
import { ProductSelectValues, ChannelSelectValues } from "@/constants";


const SideBarGenerator = () => {
    const topBarHeight = 60;

    const { state, setState, collectAndSend } = useGeneratorParameters();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prevState: GeneratorParametersState) => ({
            ...prevState,
            [name]: name === 'width' || name === 'height' ? Number(value) : value,
        }));
    };

    // const [selectedModel, setSelectedModel] = useState<string>("llama");

    // useEffect(() => { }, [selectedModel]);

    const handleProductSelectChange = (value: string) => {
        const name = "product";
        setState((prevState: GeneratorParametersState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChannelSelectChange = (value: string) => {
        const name = "channel";
        setState((prevState: GeneratorParametersState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="bg-primary-500/10 w-[400px] absolute top-[60px] left-0 rounded-[20px]"
            style={{ minHeight: `calc(100% - ${topBarHeight}px)` }}>
            <p className="base-regular md:base-regular text-center text-black m-2 mt-5">
                Параметры генерации изображений
            </p>
            <div className="flex justify-center flex-wrap">
                <GeneratorSelect onSelectChange={handleProductSelectChange}
                    selectTitle="Продукт" selectValues={ProductSelectValues} />
                <GeneratorSelect onSelectChange={handleChannelSelectChange}
                    selectTitle="Канал" selectValues={ChannelSelectValues} />
            </div>
            <Button onClick={collectAndSend}
                className="shad-button_primary px-5 mx-auto mt-10">
                Сгенерировать
            </Button>
        </div>
    )
}

export default SideBarGenerator

