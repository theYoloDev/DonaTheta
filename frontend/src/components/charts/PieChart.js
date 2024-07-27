import React from 'react';
import { Pie } from "react-chartjs-2";

export default function PieChart(
    {
        className = "",
        title,
        chartData,
        showTitle = true,
        showLegend = true
    }
) {

    return (
        <>
            <Pie
                className={`${className}`}
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
        </>
    )
}
