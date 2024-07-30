
import React from 'react';
import { Line } from "react-chartjs-2";

export default function ProgressChart({
    chartData,
    title,
    showTitle = true,
    showLegend = false
}) {


    return (
        <Line
            data={chartData}
            options={{
                plugins: {
                    title: {
                        display: showTitle,
                        text: title
                    },
                    legend: {
                        display: showLegend
                    }
                }
            }}
        />
    )
}
