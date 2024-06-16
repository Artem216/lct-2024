import React from 'react';
import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast"; // Импортируем ваш механизм уведомлений
import IconButton from './IconButton';
import cross_path from '../../assets/cross.png';
import tick_path from '../../assets/tick.png';
import repeat_path from '../../assets/repeat.png';
import { LoadingSkeleton } from './LoadingSkeleton';
import { useNavigate } from 'react-router-dom';
import ApiImage from '@/services/apiImage';
import { IRating } from '@/services/apiImage';

interface ImageCardProps {
    imgSrc: string;
    status: string;
    imgWidth: number;
    imgHeight: number;
    imgId: number;
}

const ImageGenerateCard = ({ imgSrc, status, imgWidth, imgHeight, imgId }: ImageCardProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();

    function goToConstructor() {
        let imageType = "my";
        console.log('imgId', imgId)
        navigate(`/editor/${imageType}/${imgId}`);
    }


    async function handleRating(rating: IRating) {
        const reponse = await ApiImage.changeRating(rating)
        if (reponse) {
            toast({
                title: "Вы успешно разметили",
                variant: "default",
            })
        }
    }

    return (
        <div className="flex flex-col justify-between h-[500px] max-w-[500px] border-[2px] border-solid border-secondary-500 rounded-[25px] mx-auto p-3">
            <div className="relative flex-grow rounded-[25px] overflow-hidden">
                {status === "complete" ? (
                    <img src={imgSrc} alt="generated image" className="object-contain w-full h-full" />
                ) : (
                    <LoadingSkeleton width={imgWidth} height={imgHeight} />
                )}
            </div>
            {status === "complete" &&
                <div className="flex justify-between items-center mt-3 mx-3">
                    <div className='flex gap-5'>
                        <IconButton
                            iconSrc={cross_path}
                            borderColor='#A94545'
                            altText="Edit"
                            onClick={() => handleRating({
                                imageId: imgId,
                                changeType: "delete"
                            })}
                        />
                        <IconButton
                            iconSrc={tick_path}
                            borderColor='#A4E5A2'
                            altText="Edit"
                            onClick={() => handleRating({
                                imageId: imgId,
                                changeType: "add"
                            })}
                        />
                        <IconButton
                            iconSrc={repeat_path}
                            borderColor='white'
                            altText="Edit"
                        // onClick={() => alert('Edit button clicked')}
                        />
                    </div>
                    <Button variant="default" className="shad-button_secondary px-5"
                        onClick={goToConstructor}>
                        Редактировать
                    </Button>
                </div>
            }
        </div>
    );
};

export default ImageGenerateCard;
