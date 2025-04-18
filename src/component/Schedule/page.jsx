'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import {
  startOfWeek,
  addDays,
  format,
  addWeeks,
  subWeeks,
  getMonth,
  getYear,
} from 'date-fns';

export default function WeekSwiper() {
  const [referenceDate, setReferenceDate] = useState(new Date());

  const getWeekDates = (refDate) => {
    const weekStart = startOfWeek(refDate, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  const getWeekLabel = (weekDates) => {
    const first = weekDates[0];
    const last = weekDates[weekDates.length - 1];

    const sameMonth = getMonth(first) === getMonth(last);
    const sameYear = getYear(first) === getYear(last);

    if (sameMonth && sameYear) {
      return format(first, 'MMMM yyyy');
    } else if (!sameMonth && sameYear) {
      return `${format(first, 'MMM')} - ${format(last, 'MMM yyyy')}`;
    } else {
      return `${format(first, 'MMM yyyy')} - ${format(last, 'MMM yyyy')}`;
    }
  };

  const handlePrev = () => {
    setReferenceDate((prev) => subWeeks(prev, 1));
  };

  const handleNext = () => {
    setReferenceDate((prev) => addWeeks(prev, 1));
  };

  const weekDates = getWeekDates(referenceDate);
  const label = getWeekLabel(weekDates);

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrev}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Previous Week
        </button>
        <h2 className="text-xl font-bold text-center">{label}</h2>
        <button
          onClick={handleNext}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Next Week
        </button>
      </div>

      <Swiper
        slidesPerView={7}
        slidesPerGroup={1}
        spaceBetween={10}
        modules={[Navigation]}
        navigation
      >
        {weekDates.map((date, idx) => (
          <SwiperSlide key={idx}>
            <div className="p-4 bg-white rounded shadow text-center">
              <div className="text-sm font-medium">{format(date, 'EEEE')}</div>
              <div className="text-lg font-semibold">{format(date, 'dd MMM')}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
