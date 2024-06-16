import { RotatingSquare } from 'react-loader-spinner'

interface ISkeleton {
    width: number;
    height: number;
}

export const LoadingSkeleton = ({ width, height }: ISkeleton) => {
    return (
        <div className='rounded-lg bg-white flex items-center justify-center'
            style={{ width: width < 500 ? width : 480, height: height < 500 ? height : 480 }}>
            <RotatingSquare
                visible={true}
                height={100}
                width={100}
                color="#476BF0"
                ariaLabel="rotating-square-loading"
                wrapperStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                wrapperClass=""
            />
        </div>
    )
}
