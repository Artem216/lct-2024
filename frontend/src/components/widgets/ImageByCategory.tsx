import { Link } from "react-router-dom";
import ImageTile from "../shared/ImageTile";
import { imageByCategory } from "@/constants";

const ImageByCategory = () => {
    return (
        <>
            <div className="w-[90%] mx-auto p-10 bg-light-2 rounded-2xl">
                <p className="h3-regular md:h3-bold text-center m-5 text-dark-1">ИЗОБРАЖЕНИЯ ПО КАТЕГОРИЯМ</p>
                <p className="base-regular md:base-regular text-center text-dark-1 m-2 w-[70%] mx-auto mb-5">Используй сгенерированные другими пользователями изображения в готовом виде или как отправную точку для новых изображений</p>
                <div className="flex justify-around mx-20 flex-wrap gap-10">
                    {imageByCategory.map((link) => {
                        const routejoin = `/all-cat-images/${link.category}`
                        return (
                            <Link to={routejoin}
                                key={link.title}
                                className={`flex-center flex-col gap-1 p-2 transition`}>
                                <ImageTile color={link.color} title={link.title} imgSrc={`src${link.imgURL}`}/>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default ImageByCategory