import { Button } from "../ui/button"


const HomeBanner = () => {
    return (
        <>
            <div className="w-full bg-black h-[400px] my-[100px] mx-[50px] bg-gradient-to-b from-primary-500 to-secondary-500
            rounded-tr-[15px] rounded-tl-[70px] rounded-bl-[15px] rounded-br-[70px] p-10 flex align-middle justify-center drop-shadow-2xl">
                <div className="my-auto">
                    <h1 className="h3-regular md:h1-semibold text-center m-5">Генерация изображений с помощью AI</h1>
                    <p className="base-regular md:base-regular text-center text-black m-2">Генерация изображений с нуля и на основе других изображений</p>
                    <Button className="shad-button_primary px-5 mx-auto mt-10">
                        Начать
                    </Button>
                </div>
            </div>
        </>
    )
}

export default HomeBanner