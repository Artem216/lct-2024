import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Star, Text, Image } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';

function generateShapes() {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 180,
        isDragging: false,
    }));
}

const INITIAL_STATE = generateShapes();





const CanvasDrag = () => {
    const [stars, setStars] = React.useState(INITIAL_STATE);

    const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        const id = e.target.id();
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: star.id === id,
                };
            })
        );
    };

    const handleDragEnd = (_: Konva.KonvaEventObject<DragEvent>) => {
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: false,
                };
            })
        );
    };

    const LionImage = () => {
        const [image] = useImage('https://konvajs.org/assets/lion.png');
        return <Image image={image}
            id={"0"}
            x={Math.random() * window.innerWidth}
            y={Math.random() * window.innerHeight}
            numPoints={5}
            innerRadius={20}
            outerRadius={40}
            fill="#89b717"
            opacity={0.8}
            draggable
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.6}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        />;
    };

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Text text="Try to drag a star" />
                {stars.map((star) => (
                    <Star
                        key={star.id}
                        id={star.id}
                        x={star.x}
                        y={star.y}
                        numPoints={5}
                        innerRadius={20}
                        outerRadius={40}
                        fill="#89b717"
                        opacity={0.8}
                        draggable
                        rotation={star.rotation}
                        shadowColor="black"
                        shadowBlur={10}
                        shadowOpacity={0.6}
                        shadowOffsetX={star.isDragging ? 10 : 5}
                        shadowOffsetY={star.isDragging ? 10 : 5}
                        scaleX={star.isDragging ? 1.2 : 1}
                        scaleY={star.isDragging ? 1.2 : 1}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </Layer>
        </Stage>
    );
};


export default CanvasDrag