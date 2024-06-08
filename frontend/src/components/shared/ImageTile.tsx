

interface ImageTileProps {
    color: string;
    title: string;
    imgSrc: string;
}

function ImageTile(imageProps: ImageTileProps) {
    const { color, title, imgSrc } = imageProps;

    return (
        <>
            <div className={`flex-col justify-between`}>
                <div style={{ backgroundColor: color }} className="rounded-2xl drop-shadow-2xl  w-[200px] h-[200px]">
                    <img src={imgSrc} alt={title} />
                </div>
                <p className="my-2 text-primary-500 body-bold text-center">{title}</p>
            </div>

        </>
    )
}

export default ImageTile