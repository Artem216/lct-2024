import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { useParams } from 'react-router-dom';
import { useAllImages } from '@/context/AllImagesContext';
import CanvasSideBar from './CanvasSideBar';
import { useImageConstructor } from '@/context/imageConstructorContext';
import ApiImage from '@/services/apiImage';

interface DraggableImageProps {
    x: number;
    y: number;
    onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    imgSrc: string;
    width: number;
    height: number;
    isSelected: boolean;
    onSelect: () => void;
}

interface DraggableTextProps {
    id: string;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fill: string;
    isSelected: boolean;
    onSelect: () => void;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const DraggableImage = ({
    x,
    y,
    onDragStart,
    onDragEnd,
    imgSrc,
    width,
    height,
    isSelected,
    onSelect
}: DraggableImageProps) => {
    const [image] = useImage(imgSrc, 'anonymous');
    const imageRef = useRef<Konva.Image>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (isSelected && transformerRef.current && imageRef.current) {
            transformerRef.current.nodes([imageRef.current]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

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
        <>
            <KonvaImage
                image={image}
                x={x}
                y={y}
                width={width}
                height={height}
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onClick={onSelect}
                onTap={onSelect}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={imageRef}
            />
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={true}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                />
            )}
        </>
    );
};

const DraggableText = ({
    id,
    x,
    y,
    text,
    fontSize,
    fill,
    isSelected,
    onSelect,
    onDragEnd,
}: DraggableTextProps) => {
    const textRef = useRef<Konva.Text>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (isSelected && transformerRef.current && textRef.current) {
            transformerRef.current.nodes([textRef.current]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <Text
                x={x}
                y={y}
                text={text}
                fontSize={fontSize}
                fill={fill}
                draggable
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={onDragEnd}
                ref={textRef}
                fontFamily='Helvetica'
            />
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={true}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                />
            )}
        </>
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

interface TextElement {
    id: string;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fill: string;
}

const CanvasDrag: React.FC = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const { imageId, imageType } = useParams();
    const { myCards, topAllCards } = useAllImages();
    const { color, setColor, setHeight, height, setWidth, width, fontSize,
        colorText, undo, setUndo
    } = useImageConstructor();

    const [lion, setLion] = useState<IPosition>(initialPositionState);
    const [initialLion, setInitialLion] = useState<IPosition>(initialPositionState);
    const [initialWidth, setInitialWidth] = useState<number>(512);
    const [initialHeight, setInitialHeight] = useState<number>(512);
    const [scale, setScale] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [texts, setTexts] = useState<TextElement[]>([]);
    // const [fontSize, setFontSize] = useState<number>(20);

    useEffect(() => {
        const handleResize = () => {
            const containerWidth = 1000;
            const containerHeight = 1000;
            const scaleWidth = containerWidth / width;
            const scaleHeight = containerHeight / height;
            const newScale = Math.min(scaleWidth, scaleHeight);

            if(newScale < 1) {
                setScale(newScale);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [width, height]);

    useEffect(() => {
        if (undo) {
            setLion(initialLion);
            setWidth(initialWidth);
            setHeight(initialHeight);
            setColor(initialLion.color);
            setUndo(false)
        }
    }, [undo])

    useEffect(() => {
        async function fetchImageStatus(id: number) {
            try {
                const imageCard = await ApiImage.getImageById(id);

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
                setInitialWidth(imageCard.width);
                setInitialHeight(imageCard.height);
                setLion(position);
                setInitialLion(position);
                setIsLoading(false);
                setColor(imageCard.colour);
            } catch (error) {
                console.log(error)
            }
        }

        if (imageType === "my") {
            const imageCard = myCards.find(card => card.req_id === Number(imageId));
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
                setInitialWidth(imageCard.width);
                setInitialHeight(imageCard.height);
                setLion(position);
                setInitialLion(position);
                setIsLoading(false);
                setColor(imageCard.colour);
            }
        }
        else {
            const imageCard = topAllCards.find(card => card.id === Number(imageId));
            if (imageCard) {
                fetchImageStatus(imageCard.id)
            }
        }
    }, [imageId, imageType, myCards]);

    useEffect(() => {
        setLion(lion => ({
            ...lion,
            color: color,
        }));
    }, [color]);

    const handleDragStart = () => {
        setLion(lion => ({
            ...lion,
            isDragging: true,
        }));
    };

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        setLion(lion => ({
            ...lion,
            x: e.target.x(),
            y: e.target.y(),
            isDragging: false,
        }));
    };

    const handleImageSelect = () => {
        setSelectedId('image');
    };

    const handleTextSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleAddText = (text: string) => {
        const newText: TextElement = {
            id: `text-${texts.length + 1}`,
            x: 50,
            y: 50 + texts.length * 20,
            text: text,
            fontSize: fontSize,
            fill: "black",
        };
        setTexts([...texts, newText]);
    };

    const handleTextDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        const updatedTexts = texts.map(text =>
            text.id === id ? { ...text, x: e.target.x(), y: e.target.y() } : text
        );
        setTexts(updatedTexts);
    };

    const handleRemoveAllTexts = () => {
        setTexts([]);
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
            <div className='flex justify-around px-10 items-center' style={{ height: `calc(100vh - ${topBarHeight}px)` }}>
                {!isLoading &&
                    <Stage
                        width={width * scale}
                        height={height * scale}
                        ref={stageRef}
                        scaleX={scale}
                        scaleY={scale}
                        onMouseDown={e => {
                            const clickedOnEmpty = e.target === e.target.getStage();
                            if (clickedOnEmpty) {
                                setSelectedId(null);
                            }
                        }}
                    >
                        <Layer>
                            <Rect
                                x={0}
                                y={0}
                                width={width}
                                height={height}
                                fill={lion.color}
                            />
                            <DraggableImage
                                x={lion.x}
                                y={lion.y}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                imgSrc={lion.imgSrc}
                                width={lion.width}
                                height={lion.height}
                                isSelected={selectedId === 'image'}
                                onSelect={handleImageSelect}
                            />
                            {texts.map(text => (
                                <DraggableText
                                    key={text.id}
                                    id={text.id}
                                    x={text.x}
                                    y={text.y}
                                    text={text.text}
                                    fontSize={fontSize}
                                    fill={colorText}
                                    isSelected={selectedId === text.id}
                                    onSelect={() => handleTextSelect(text.id)}
                                    onDragEnd={e => handleTextDragEnd(text.id, e)}
                                />
                            ))}
                        </Layer>
                    </Stage>
                }
                <div className='text-black'>
                    <CanvasSideBar handleClick={handleExport} handleAddText={handleAddText}
                        handleRemoveAllTexts={handleRemoveAllTexts} />
                </div>
            </div>
        </>
    );
};

export default CanvasDrag;
