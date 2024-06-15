import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { useParams } from 'react-router-dom';
import { useAllImages } from '@/context/AllImagesContext';
import CanvasSideBar from './CanvasSideBar';
import { useImageConstructor } from '@/context/imageConstructorContext';

interface DraggableImageProps {
    x: number;
    y: number;
    onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
    imgSrc: string;
    width: number;
    height: number;
}

function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const DraggableImage = ({ x, y, onDragStart, onDragEnd, onDragMove, imgSrc, width, height }: DraggableImageProps) => {
    const [image] = useImage(imgSrc, 'anonymous');

    const handleMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (stage) {
            stage.container().style.cursor = 'pointer';
        }
    };

    const handleMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (stage) {
            stage.container().style.cursor = 'default';
        }
    };

    return (
        <KonvaImage
            image={image}
            x={x}
            y={y}
            width={width}
            height={height}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragMove={onDragMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    );
};

interface IPosition {
    x: number;
    y: number;
    isDragging: boolean;
    imgSrc: string;
    width: number;
    height: number;
    color: string;
}

const initialPositionState: IPosition = {
    x: Math.random() * 512,
    y: Math.random() * 512,
    isDragging: false,
    imgSrc: '',
    width: 100,
    height: 100,
    color: "red",
};

const CanvasDrag: React.FC = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const { imageId, imageType } = useParams();
    const { myCards, topAllCards } = useAllImages();
    const { color, setColor, setHeight, height, setWidth, width } = useImageConstructor();

    // const [width, setWidth] = useState(512);
    // const [height, setHeight] = useState(512);
    const [lion, setLion] = useState<IPosition>(initialPositionState);
    const [initialLion, setInitialLion] = useState<IPosition>(initialPositionState);
    const [scale, setScale] = useState(1);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            const containerWidth = 1000;
            const containerHeight = 1000;
            const scaleWidth = containerWidth / width;
            const scaleHeight = containerHeight / height;
            const newScale = Math.min(scaleWidth, scaleHeight);

            setScale(newScale);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [width, height]);

    useEffect(() => {
        if (imageType === "my") {
            const imageCard = myCards.filter((card) => { return card.req_id === Number(imageId) })[0];
            if (imageCard) {
                const position: IPosition = {
                    x: imageCard.x,
                    y: imageCard.y,
                    isDragging: false,
                    imgSrc: imageCard.child_s3_url,
                    width: imageCard.child_w,
                    height: imageCard.child_h,
                    color: imageCard.colour,
                };
                setWidth(imageCard.width);
                setHeight(imageCard.height);
                setLion(position);
                setInitialLion(position);
                setIsLoading(false);
                setColor(imageCard.colour);
            }
        }
    }, [imageId, imageType, myCards]);

    useEffect(() => {
        setLion({
            ...lion,
            color: color,
        });
    }, [color])

    const handleDragStart = () => {
        setLion({
            ...lion,
            isDragging: true,
        });
    };

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        setLion({
            ...lion,
            x: e.target.x(),
            y: e.target.y(),
            isDragging: false,
        });
    };

    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        const image = e.target;
        const stage = image.getStage();
        const layer = image.getLayer();

        // if (stage && layer) {
        //     const box = image.getClientRect();
        //     const width = stage.width();
        //     const height = stage.height();

        //     if (box.x < 0) {
        //         image.x(0 - image.offsetX());
        //     }
        //     if (box.y < 0) {
        //         image.y(0 - image.offsetY());
        //     }
        //     if (box.x + box.width > width) {
        //         image.x(width - box.width - image.offsetX());
        //     }
        //     if (box.y + box.height > height) {
        //         image.y(height - box.height - image.offsetY());
        //     }
        // }
    };

    const handleExport = () => {
        if (stageRef.current) {
            const uri = stageRef.current.toDataURL();
            downloadURI(uri, 'Изображение.png');
        }
    };
    const topBarHeight = 90;

    return (
        <>
            <div className='flex justify-around px-10 items-center'
                style={{ height: `calc(100vh - ${topBarHeight}px)` }}>
                {!isLoading &&
                    <Stage
                        width={width * scale}
                        height={height * scale}
                        ref={stageRef}
                        scaleX={scale}
                        scaleY={scale}
                    >
                        <Layer>
                            <Rect
                                x={0}
                                y={0}
                                width={width}
                                height={height}
                                fill={lion.color}
                            />
                             <Text
                                text="Some text on canvas"
                                fontSize={50}
                                draggable
                                fill='red'
                                x={0}
                                y={0}
                            />
                            <DraggableImage
                                x={lion.x}
                                y={lion.y}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragMove={handleDragMove}
                                imgSrc={lion.imgSrc}
                                width={lion.width}
                                height={lion.height}
                            />
                        </Layer>
                    </Stage>
                }
                <div className='text-black'>
                    <CanvasSideBar handleClick={handleExport} />
                </div>
            </div>
        </>
    );
};

export default CanvasDrag;
