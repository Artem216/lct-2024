

interface ImageTileProps {
    color: string;
    title: string;
    imgSrc: string;
}

function ImageTile(imageProps: ImageTileProps) {
    const { color, title, imgSrc } = imageProps;

    return (
        <>
            <div className='flex-col justify-between mx-auto'>
                <div style={{ backgroundColor: color }} className="rounded-2xl drop-shadow-lg  w-[250px] h-[250px]">
                    <img src={imgSrc} alt={title} />
                </div>
                <p className="my-2 text-primary-500 body-bold text-center">{title}</p>
            </div>

        </>
    )
}

export default ImageTile