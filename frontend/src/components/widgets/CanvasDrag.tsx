import React, { useEffect, useRef } from 'react';
import img_path from "../../assets/card_ok.png"

const CanvasDrag = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const image = new Image();
        const handleImageLoad = () => {
            context.drawImage(image, 0, 0); // Draw the image at position (0, 0) on the canvas 

        };
        image.addEventListener('load', handleImageLoad);
        image.src = img_path; // Set the image source 
        return () => {
            image.removeEventListener('load', handleImageLoad); // Remove the event listener on cleanup 
        };
    }, []);

    return <canvas ref={canvasRef} />

};

export default CanvasDrag;