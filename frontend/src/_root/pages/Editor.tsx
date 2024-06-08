import React, { useState, useRef, useEffect } from "react";

const Editor: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const image = imageRef.current;
        if (image) {
            image.onload = () => {
                drawCanvas();
            };
        }
    }, [imageUrl, selectedColor]);

    const drawCanvas = () => {
        const container = containerRef.current;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (container && context) {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            canvas.width = width;
            canvas.height = height;

            // Fill background with selected color
            context.fillStyle = selectedColor;
            context.fillRect(0, 0, width, height);

            // Draw the image
            if (imageRef.current) {
                context.drawImage(imageRef.current, 0, 0, width, height);
            }

            // Set the canvas element to state
            setCanvasElement(canvas);
        }
    };

    const download = () => {
        if (canvasElement) {
            const link = document.createElement("a");
            link.download = "merged_image.png";
            link.href = canvasElement.toDataURL("image/png");
            link.click();
        }
    }

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === "string") {
                    setImageUrl(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <div>
                <label htmlFor="color-picker">Choose a color:</label>
                <input
                    type="color"
                    id="color-picker"
                    value={selectedColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="image-upload">Upload an image:</label>
                <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    onChange={handleImageUpload}
                />
            </div>
            <div
                ref={containerRef}
                style={{
                    position: "relative",
                    width: "600px",
                    height: "600px",
                    backgroundColor: selectedColor,
                    marginTop: "20px",
                }}
            >
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Uploaded"
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                        ref={imageRef}
                    />
                )}
            </div>
            <button onClick={download} style={{ color: "red" }}>
                Download as PNG
            </button>
        </div>
    );
};

export default Editor;
