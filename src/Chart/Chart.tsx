import './Chart.css';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useState } from 'react';

// Desired length of video in seconds
const VIDEO_LENGTH = 60;
// Desired FPS capped at 250
const DESIRED_FPS = 60;

interface Column {
    name: string;
    image: string;
    color: string;
    data: string[];
    currentValue: number;
}

export function Chart() {
    const [animationParent] = useAutoAnimate();
    const [bars, setBars] = useState<number[]>([1,2,3,4,5,6,7,8,9,10]);
    const startAnimation = () => {
        fetch('./data.txt')
        .then(r => r.text())
        .then(text => {
            let dataArray = text.split("\r\n").map(function (line) {
                return line.split(',');
            });
            let columns: Column[] = [];
            for (let i = 1; i < dataArray[0].length; i++) {
                const column: Column = {
                    name: dataArray[0][i],
                    image: dataArray[1][i],
                    color: dataArray[2][i],
                    data: [],
                    currentValue: Number(dataArray[3][i])
                }
                columns.push(column);
            }
            const years = [];
            for (let i = 3; i < dataArray.length; i++) {
                years.push(dataArray[i][0]);
                for (let j = 1; j < dataArray[0].length; j++) {
                    columns[j - 1].data.push(dataArray[i][j]);
                }
            }
            let chartBars = document.getElementsByClassName('bar-container') as HTMLCollectionOf<HTMLElement>;
            let index = 0;
            for (let i = 0; i < years.length - 1; i++) {
                for (let j = 0; j < DESIRED_FPS; j++) {
                    setTimeout(() => {
                        for (const column of columns) {
                            column.currentValue += (Number(column.data[i + 1]) - Number(column.data[i]) * (j + 1)) / DESIRED_FPS;
                        }
                        columns.sort((a,b) => a.currentValue - b.currentValue);
                        
                        for (let i = 0; i < 10 || i < columns.length; i++) {
                            const bar = chartBars[i];
                            bar.innerHTML = columns[i].currentValue.toString();
                            bar.style.width = `${columns[i].currentValue * 100 / columns[0].currentValue}vw`
                        }
                    }, (index * 1000) / DESIRED_FPS);
                    index++;
                } 
            }
        });
    }
    return(
        <div className="chart-overall-container">
            <button onClick={() => startAnimation()}>start animation</button>
            <div className='chart-container'>
                <ul ref={animationParent}>
                    {bars.map((bar, index) => (
                        <li key={index} className='bar-container'>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    );
}