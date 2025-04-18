"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { addDays, format, getMonth, getYear, startOfDay } from "date-fns";

export default function WeekSwiper() {
  const [referenceDate, setReferenceDate] = useState(startOfDay(new Date()));

  // Create a long sliding window (e.g., 30 days before and after)
  const totalDays = 60;
  const startDate = addDays(referenceDate, -30);
  const allDates = Array.from({ length: totalDays }, (_, i) =>
    addDays(startDate, i)
  );

  // Determine initial slide so that today is at the leftmost
  const initialSlide = allDates.findIndex(
    (date) => format(date, "yyyy-MM-dd") === format(referenceDate, "yyyy-MM-dd")
  );

  const getMonthLabel = (startDate, endDate) => {
    const sameMonth = getMonth(startDate) === getMonth(endDate);
    const sameYear = getYear(startDate) === getYear(endDate);

    if (sameMonth && sameYear) {
      return format(startDate, "MMMM yyyy");
    } else if (!sameMonth && sameYear) {
      return `${format(startDate, "MMM")} - ${format(endDate, "MMM yyyy")}`;
    } else {
      return `${format(startDate, "MMM yyyy")} - ${format(
        endDate,
        "MMM yyyy"
      )}`;
    }
  };

  const label = getMonthLabel(
    allDates[initialSlide],
    allDates[initialSlide + 6]
  );

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center w-full">{label}</h2>
      </div>

      <Swiper
        slidesPerView={7}
        slidesPerGroup={1} // slide one at a time
        spaceBetween={10}
        modules={[Navigation]}
        navigation
        initialSlide={initialSlide}
      >
        {allDates.map((date, idx) => {
          const isToday =
            format(date, "yyyy-MM-dd") ===
            format(startOfDay(new Date()), "yyyy-MM-dd");

          return (
            <SwiperSlide key={idx}>
              <div
                className={`p-4 rounded shadow text-center ${
                  isToday ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                <div className="text-sm font-medium">
                  {format(date, "EEEE")}
                </div>
                <div className="text-lg font-semibold">
                  {format(date, "dd MMM")}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
