"use client";
import { useState, useEffect, useRef } from "react";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import "./schedule.css";
import Link from "next/link";
// import { Link } from "react-router-dom";

export default function Schedule(props) {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(null);
  const [scheduleData, setscheduleData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const cardRefs = useRef([]);
  const swiperRef = useRef(null);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "short" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const GMTOffset = `GMT ${
    new Date().getTimezoneOffset() > 0 ? "-" : "+"
  }${String(Math.floor(Math.abs(new Date().getTimezoneOffset()) / 60)).padStart(
    2,
    "0"
  )}:${String(Math.abs(new Date().getTimezoneOffset()) % 60).padStart(2, "0")}`;
  const months = [];

  useEffect(() => {
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayname = date.toLocaleString("default", { weekday: "short" });
      const yearr = date.getFullYear();
      const monthh = String(date.getMonth() + 1).padStart(2, "0");
      const dayy = String(date.getDate()).padStart(2, "0");
      const fulldate = `${yearr}-${monthh}-${dayy}`;
      months.push({ day, monthName, dayname, fulldate });
    }
    setDates(months);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const todayIndex = dates.findIndex(
      (date) =>
        date.fulldate ===
        `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`
    );

    if (todayIndex !== -1) {
      setCurrentActiveIndex(todayIndex);
      toggleActive(todayIndex);
    }
  }, [dates]);

  const fetchSched = (date) => {
    try {
      setLoading(true);
      const daySchedule = props.schedule.find((entry) => entry._id === date);
      setscheduleData(daySchedule?.schedule || []);
    } catch (err) {
      console.error("Error processing schedule data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = (index) => {
    cardRefs.current.forEach((card) => {
      if (card) {
        card.classList.remove("active");
      }
    });
    if (cardRefs.current[index]) {
      cardRefs.current[index].classList.add("active");
      if (dates[index] && dates[index].fulldate) {
        fetchSched(dates[index].fulldate);
      }
      setCurrentActiveIndex(index);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    setShowAll(false);
    if (currentActiveIndex !== null && swiperRef.current) {
      swiperRef.current.slideTo(currentActiveIndex);
    }
  }, [currentActiveIndex]);

  return (
    <>
      <div className="schedule-wrapper">
        <div className="schedule-header">
          <div className="schedule-title">Estimated Schedule</div>
          <p className="schedule-time">
            ({GMTOffset}) {currentTime.toLocaleDateString()}{" "}
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="schedule-slider-wrapper">
        <div className="schedule-slider">
          <Swiper
            slidesPerView={3}
            spaceBetween={2}
            breakpoints={{
              250: { slidesPerView: 3, spaceBetween: 10 },
              640: { slidesPerView: 4, spaceBetween: 10 },
              768: { slidesPerView: 5, spaceBetween: 10 },
              1024: { slidesPerView: 7, spaceBetween: 10 },
              1300: { slidesPerView: 7, spaceBetween: 15 },
            }}
            modules={[Pagination, Navigation]}
            navigation={{ nextEl: ".next", prevEl: ".prev" }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {dates &&
              dates.map((date, index) => (
                <SwiperSlide key={index}>
                  <div
                    ref={(el) => (cardRefs.current[index] = el)}
                    onClick={() => toggleActive(index)}
                    className={`schedule-day-card ${
                      currentActiveIndex === index ? "active" : ""
                    }`}
                  >
                    <div className="day-name">{date.dayname}</div>
                    <div className="day-date">
                      {date.monthName} {date.day}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
          <button className="next slider-nav">
            <FaChevronRight className="slider-icon" />
          </button>
          <button className="prev slider-nav">
            <FaChevronLeft className="slider-icon" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loader-wrapper">
          <BouncingLoader />
        </div>
      ) : !scheduleData || scheduleData.length === 0 ? (
        <div className="no-data">No data to display</div>
      ) : error ? (
        <div className="no-data">Something went wrong</div>
      ) : (
        <div className="schedule-list">
          {(showAll ? scheduleData : scheduleData.slice(0, 7)).map(
            (item, idx) => (
              <Link href={`/${item.id}`} key={idx} className="schedule-item">
                <div className="item-info">
                  <div className="item-time">{item.time || "N/A"}</div>
                  <h3 className="item-title">{item.title || "N/A"}</h3>
                </div>
                <button className="item-button">
                  <FontAwesomeIcon icon={faPlay} className="item-icon" />
                  <p className="item-episode">
                    Episode {item.episode_no || "N/A"}
                  </p>
                </button>
              </Link>
            )
          )}
          {scheduleData.length > 7 && (
            <button onClick={toggleShowAll} className="toggle-show">
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      )}
    </>
  );
}
