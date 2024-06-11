import React from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';

interface LionImageProps {
    x: number;
    y: number;
    onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const LionImage = ({ x, y, onDragStart, onDragEnd, onDragMove }: LionImageProps) => {
    const [image] = useImage('https://konvajs.org/assets/lion.png', 'anonymous'); // Enable CORS

    return (
        <KonvaImage
            image={image}
            x={x}
            y={y}
            width={100}
            height={100}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragMove={onDragMove}
        />
    );
};

const CanvasDrag = () => {
    const stageRef = React.useRef<Konva.Stage>(null);

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

    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        const image = e.target;
        const stage = image.getStage();
        const layer = image.getLayer();

        if (stage && layer) {
            const box = image.getClientRect();
            const width = stage.width();
            const height = stage.height();

            if (box.x < 0) {
                image.x(0 - image.offsetX());
            }
            if (box.y < 0) {
                image.y(0 - image.offsetY());
            }
            if (box.x + box.width > width) {
                image.x(width - box.width - image.offsetX());
            }
            if (box.y + box.height > height) {
                image.y(height - box.height - image.offsetY());
            }
        }
    };

    const handleExport = () => {
        if (stageRef.current) {
            const uri = stageRef.current.toDataURL();
            downloadURI(uri, 'stage.png');
        }
    };

    return (
        <>
            <button onClick={handleExport}>Download</button>
            <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        fill="blue"
                    />
                    {/* <Text text="Try to drag the lion" fontSize={20} fill="white" /> */}
                    <LionImage
                        x={lion.x}
                        y={lion.y}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragMove={handleDragMove}
                    />
                </Layer>
            </Stage>
        </>
    );
};


export default CanvasDrag;
