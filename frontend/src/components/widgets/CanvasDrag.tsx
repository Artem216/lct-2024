import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Text, Image } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';


interface LineImageProps {
    x: number;
    y: number;
    onDragStart: any;
    onDragEnd: any;
}

const LionImage = ({ x, y, onDragStart, onDragEnd } : LineImageProps) => {
    const [image] = useImage('https://konvajs.org/assets/lion.png');
    return (
        <Image
            image={image}
            x={x}
            y={y}
            width={100}
            height={100}
            draggable
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.6}
            shadowOffsetX={5}
            shadowOffsetY={5}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        />
    );
};

const CanvasDrag = () => {
    const initialPosition = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        isDragging: false,
    };
    
    const [lion, setLion] = React.useState(initialPosition);

    const handleDragStart = () => {
        setLion({
            ...lion,
            isDragging: true,
        });
    };

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        setLion({
            x: e.target.x(),
            y: e.target.y(),
            isDragging: false,
        });
    };

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Text text="Try to drag the lion" fontSize={20} />
                <LionImage
                    x={lion.x}
                    y={lion.y}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                />
            </Layer>
        </Stage>
    );
};


export default CanvasDrag;
