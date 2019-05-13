import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
    Cheap: {
        min: 0,
        max: 100
    },
    Normal: {
        min: 100,
        max: 200
    },
    Expensive: {
        min: 200,
        max: 1000000000
    }
}

const bookingsChart = props => {
    const chartData = {labels:  [], datasets: []};
    let values = [];
    for(const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if(current.event.price >= BOOKINGS_BUCKETS[bucket].min && current.event.price < BOOKINGS_BUCKETS[bucket].max) {
                return prev + 1
            }
            else {
                return prev;
            }
        }, 0);
        values.push(filteredBookingsCount);
        chartData.labels.push(bucket);
    }

    chartData.datasets = [{
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,0.8)",
        highlightFill: "rgba(81,1,209,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: values           
    }];

    return (
        <div style={{textAlign: 'center'}}>
            <BarChart data={chartData}/>
        </div>
    );
};

export default bookingsChart;