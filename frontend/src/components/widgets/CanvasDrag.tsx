import { useRef, useEffect, MouseEvent, useState } from "react";
import img_path from '../../assets/card_ok.png'

interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
    img: HTMLImageElement;
}

interface CanvasStyle {
    backgroundColor?: string;
}

function CanvasDrag() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    let getCtx: CanvasRenderingContext2D | null = null;
    const canBoxes: Box[] = [
        { x: 190, y: 250, w: 120, h: 70, img: new Image() },
        { x: 110, y: 115, w: 100, h: 70, img: new Image() },
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
        const loadImage = (index: number, src: string) => {
            canBoxes[index].img.src = src;
            canBoxes[index].img.onload = () => {
                setImageLoaded(true);
                canvasDraw();  
            };
        };

        loadImage(0, "src/assets/card_ok.png"); 
    }, []);

    const canvasDraw = () => {
        const canvasDimensions = canvas.current;
        if (canvasDimensions && canvasDimensions.getContext) {
            const ctx = canvasDimensions.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, canvasDimensions.clientWidth, canvasDimensions.clientHeight);
                ctx.fillStyle = "#FFF";
                ctx.fillRect(0, 0, canvasDimensions.clientWidth, canvasDimensions.clientHeight);
                canBoxes.forEach((info) => fillCanvas(ctx, info));
            }
        }
    };

    const fillCanvas = (ctx: CanvasRenderingContext2D, info: Box) => {
        const { x, y, w, h, img } = info;
        console.log("here", img)
        ctx.drawImage(img, x, y, w, h);
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
                style={{ border: "1px solid black" }}
            ></canvas>
        </div>
    );
}

export default CanvasDrag;
