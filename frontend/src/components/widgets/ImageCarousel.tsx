import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { IResponseCard, IResponseImage } from '@/services/apiImage';

interface ImageCarouselProps {
    openCarousel: boolean;
    setOpenCarousel: (open: boolean) => void;
    topImages: IResponseCard[] | IResponseImage[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ openCarousel, setOpenCarousel, topImages }) => {
    return (
        <div>
            <Dialog open={openCarousel} onOpenChange={setOpenCarousel}>
                <DialogContent className="w-full max-w-[800px] max-h-[90vh] p-0">
                    <div className="relative">
                        <Carousel className="w-full max-h-[90vh]">
                            <CarouselContent>
                                {topImages.map((image, index) => (
                                    <CarouselItem key={index} className="flex justify-center items-center">
                                        <img
                                            src={image.parent_s3_url}
                                            alt="image"
                                            className="object-contain max-w-full max-h-full"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                <ChevronLeftIcon className="w-8 h-8 text-white bg-gray-900/50 rounded-full p-2 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:text-gray-900 dark:bg-gray-50/50 dark:hover:bg-gray-50" />
                            </CarouselPrevious>
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                                <ChevronRightIcon className="w-8 h-8 text-white bg-gray-900/50 rounded-full p-2 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:text-gray-900 dark:bg-gray-50/50 dark:hover:bg-gray-50" />
                            </CarouselNext>
                        </Carousel>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

export default ImageCarousel;
