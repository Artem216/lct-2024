import { useRef, useEffect, MouseEvent } from "react";

interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface CanvasStyle {
    backgroundColor?: string;
}

function CanvasDrag() {
    const canvas = useRef<HTMLCanvasElement>(null);
    let getCtx: CanvasRenderingContext2D | null = null;
    const canBoxes: Box[] = [
        { x: 190, y: 250, w: 120, h: 70 },
        { x: 110, y: 115, w: 100, h: 70 },
    ];
    let isMoveDown: boolean = false;
    let targetCanvas: Box | null = null;
    let startX: number | null = null;
    let startY: number | null = null;

    useEffect(() => {
        const canvasDimensions = canvas.current;
        if (canvasDimensions) {
            canvasDimensions.width = canvasDimensions.clientWidth;
            canvasDimensions.height = canvasDimensions.clientHeight;
            getCtx = canvasDimensions.getContext("2d");
        }
    }, []);

    useEffect(() => {
        canvasDraw();
    }, []);

    const canvasDraw = () => {
        if (getCtx && canvas.current) {
            getCtx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
            canBoxes.forEach((info) => fillCanvas(info));
        }
    };

    const fillCanvas = (info: Box, style: CanvasStyle = {}) => {
        if (getCtx) {
            const { x, y, w, h } = info;
            const { backgroundColor = "#000000" } = style;

            getCtx.beginPath();
            getCtx.fillStyle = backgroundColor;
            getCtx.fillRect(x, y, w, h);
        }
    };

    const moveableItem = (x: number, y: number): boolean => {
        for (let i = 0; i < canBoxes.length; i++) {
            const block = canBoxes[i];
            if (x >= block.x && x <= block.x + block.w && y >= block.y && y <= block.y + block.h) {
                targetCanvas = block;
                return true;
            }
        }
        return false;
    };

    const onMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        startX = e.nativeEvent.offsetX - (canvas.current?.clientLeft ?? 0);
        startY = e.nativeEvent.offsetY - (canvas.current?.clientTop ?? 0);
        isMoveDown = moveableItem(startX, startY);
    };

    const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isMoveDown) return;

        const mouseX = e.nativeEvent.offsetX - (canvas.current?.clientLeft ?? 0);
        const mouseY = e.nativeEvent.offsetY - (canvas.current?.clientTop ?? 0);
        const mouseStartX = mouseX - (startX ?? 0);
        const mouseStartY = mouseY - (startY ?? 0);
        startX = mouseX;
        startY = mouseY;
        if (targetCanvas) {
            targetCanvas.x += mouseStartX;
            targetCanvas.y += mouseStartY;
            canvasDraw();
        }
    };

    const onMouseUp = () => {
        targetCanvas = null;
        isMoveDown = false;
    };

    const onMouseOut = (_: MouseEvent<HTMLCanvasElement>) => {
        onMouseUp();
    };

    return (
        <div>
            <canvas
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                ref={canvas}
            ></canvas>
        </div>
    );
}

export default CanvasDrag;
