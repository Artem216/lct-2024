import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useAdmin } from '@/context/AdminContext';

interface DataPoint {
    x: string;
    y: number;
}

interface TransformedData {
    id: string;
    data: DataPoint[];
}

const LineGenChart = (props: any) => {
    const { generatedStatistics } = useAdmin();
    const [transformedData, setTransformedData] = useState<TransformedData[]>([
        {
            id: "Statistics",
            data: []
        }
    ]);

    useEffect(() => {
        if (generatedStatistics && generatedStatistics.x && generatedStatistics.y) {
            const data: DataPoint[] = generatedStatistics.x.map((label, index) => ({
                x: label,
                y: generatedStatistics.y[index]
            }));
            console.log(data)
            setTransformedData([
                {
                    id: "Statistics",
                    data: data
                }
            ]);
        }
    }, [generatedStatistics]);

    return (
        <div {...props}>
            <ResponsiveLine
                data={transformedData}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: 0, max: "auto" }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{ tickSize: 0, tickPadding: 16 }}
                axisLeft={{ tickSize: 0, tickValues: 5, tickPadding: 16 }}
                colors={["#2563eb", "#e11d48"]}
                pointSize={6}
                useMesh={true}
                gridYValues={6}
                theme={{
                    tooltip: {
                        chip: { borderRadius: "9999px" },
                        container: {
                            fontSize: "12px",
                            textTransform: "capitalize",
                            borderRadius: "6px",
                        },
                    },
                    grid: {
                        line: { stroke: "#f3f4f6" },
                    },
                }}
                role="application"
            />
        </div>
    );
};

export default LineGenChart;
