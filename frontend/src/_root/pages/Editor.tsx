import CanvasDrag from "@/components/widgets/CanvasDrag"
import { ImageConstructorProvider } from "@/context/imageConstructorContext"

const Editor = () => {
    return (
        <>
            <ImageConstructorProvider>
                <CanvasDrag />
            </ImageConstructorProvider>
        </>
    )
}

export default Editor