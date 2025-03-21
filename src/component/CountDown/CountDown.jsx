import React, { useState, useEffect } from "react";

function CountdownTimer({ targetDate, targetTime }) {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const targetTimestamp = new Date(`${targetDate} ${targetTime}`).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setTimeRemaining("00 : 00 : 00 : 00");
        return;
      }

      const seconds = Math.floor((difference / 1000) % 60);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      const formatTime = (value) => (value < 10 ? `0${value}` : value);

      if (days > 0) {
        setTimeRemaining(
          `${formatTime(days)} : ${formatTime(hours)} : ${formatTime(
            minutes
          )} : ${formatTime(seconds)}`
        );
      } else {
        setTimeRemaining(
          `${formatTime(hours)} : ${formatTime(minutes)} : ${formatTime(
            seconds
          )}`
        );
      }
    };

    const timerId = setInterval(updateCountdown, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timerId);
  }, [targetDate, targetTime]);

  return <div>{timeRemaining}</div>;
}

export default CountdownTimer;
