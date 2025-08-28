import { useState, useEffect } from 'react';

export default function Clock(props) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const updateTime = setInterval(() => {
            setCurrentTime(new Date());
        }, 10 * 1000);
        return () => clearInterval(updateTime);
    }, []);

    const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let day = dayList[currentTime.getDay()];
    let hour = currentTime.getHours();
    let minute = currentTime.getMinutes();
    let month = monthList[currentTime.getMonth()];
    let date = currentTime.getDate().toLocaleString();
    let meridiem = (hour < 12 ? "AM" : "PM");

    if (minute.toLocaleString().length === 1) {
        minute = "0" + minute;
    }

    if (props.hour12 && hour > 12) hour -= 12;

    let displayTime;
    if (props.onlyTime) {
        displayTime = hour + ":" + minute + " " + meridiem;
    } else if (props.onlyDay) {
        displayTime = day + " " + month + " " + date;
    } else {
        displayTime = day + " " + month + " " + date + " " + hour + ":" + minute + " " + meridiem;
    }
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return <span>{isClient ? displayTime: ""}</span>;
}
