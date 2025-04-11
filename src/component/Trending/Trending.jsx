// components/Trending/Trending.js
"use client";
import React, { useState, useEffect } from "react";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./Trending.css";
import Link from "next/link";

function transformURL(originalURL) {
  if (!originalURL) return null; // Handle null/undefined cases

  // Extract the 32-character hash from the original URL
  const idMatch = originalURL.match(/\/([a-f0-9]{32})\.jpg$/);
  if (!idMatch) return originalURL; // Return original URL if no match

  const id = idMatch[1]; // Full hash ID
  const part1 = id.substring(0, 2); // First 2 characters
  const part2 = id.substring(2, 4); // Next 2 characters

  // Construct the new URL
  return `https://img.flawlessfiles.com/_r/300x400/100/${part1}/${part2}/${id}/${id}.jpg`;
}

export default function Trending(props) {
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    // Retrieve all relevant localStorage data
    const storageData = {};
    props.data?.forEach((el) => {
      storageData[el.id] = localStorage.getItem(`Rewo-${el.id}`);
    });
    setLocalStorageData(storageData);
  }, [props.data]);

  const animeCard = props.data?.map((el, idx) => {
    const title = props.selectL === "en" ? el.title : el.japanese_title;

    return (
      <SwiperSlide key={el.id} className="trending-slide">
        <div>
          <div className="trending-item-sidebar">
            <p>{title.length > 15 ? title.slice(0, 15) + "..." : title}</p>
            {/* You can use ranking data from API if available, else remove */}
            <span>{idx + 1 > 9 ? idx + 1 : "0" + (idx + 1).toString()}</span>
          </div>
          <Link
            href={`${
              localStorageData[el.id]
                ? `/watch/${localStorageData[el.id]}`
                : `/watch/${el.id}`
            }`}
            prefetch
          >
            <img src={el.poster} className="trending-slide-img" alt={title} />
          </Link>
        </div>
      </SwiperSlide>
    );
  });

  return (
    <div className="trending-section-wrapper">
      <h1 className="section-header">Trending</h1>
      <Swiper
        className="swiper"
        modules={[Navigation]}
        breakpoints={{
          1700: {
            slidesPerView: 8,
            spaceBetween: 10,
          },
          1600: {
            slidesPerView: 7,
            spaceBetween: 10,
          },
          1450: {
            slidesPerView: 6,
            spaceBetween: 10,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
          900: {
            slidesPerView: 4,
          },
          200: {
            slidesPerView: 2,
          },
          300: {
            slidesPerView: 3,
          },
        }}
        spaceBetween={5}
        slidesPerView={3}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".btn-nextTwo",
          prevEl: ".btn-prevTwo",
        }}
      >
        {animeCard}
        <div className="trending-swiper-navigation trans-c-03">
          <div className="btn-nextTwo swiper-controls d-flex a-center j-center">
            <FaChevronRight size={20} />
          </div>
          <div className="btn-prevTwo swiper-controls d-flex a-center j-center">
            <FaChevronLeft size={20} />
          </div>
        </div>
      </Swiper>
    </div>
  );
}
