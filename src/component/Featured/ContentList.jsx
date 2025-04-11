import React from "react";
import "./content-list.css";
import { FaChevronRight, FaClosedCaptioning } from "react-icons/fa";
import Link from "next/link";
import { AiFillAudio } from "react-icons/ai";

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

export default function ContentList(props) {
  const list = props?.data?.map((el, idx) => {
    // Extracting title, falling back to romaji or English if not available
    const title = props.selectL === "en" ? el.title : el.japanese_title;

    return (
      <li key={el.id} className="d-flex a-center">
        <Link href={`/${el.id}`}>
          <img src={el.poster} alt={title} isAnimated={false} />
        </Link>

        <div className="anime-details d-flex-fd-column">
          <span className="title">
            <Link href={`/${el.id}`} className="trans-03">
              {title.length > 50 ? title.slice(0, 50) + "..." : title}
            </Link>
          </span>
          <div className="episode-info d-flex f-ubuntu">
            <span
              className={` ${
                el.tvInfo.dub ? "extra-epi-co" : ""
              } episode-count`}
            >
              <FaClosedCaptioning size={14} />
              {
                el.tvInfo?.sub
                // || el.nextAiringEpisode ? el.nextAiringEpisode.episode -1 : el.tvInfo  || "?"
              }
            </span>{" "}
            {el.tvInfo?.dub ? (
              <span className="episode-count-dub d-flex a-center j-center">
                <AiFillAudio size={14} />
                {el.tvInfo?.dub || "?"}
              </span>
            ) : (
              ""
            )}
            <div className="dot"></div>
            <div className="show-type">{el.tvInfo.showType || "TV"}</div>
          </div>
        </div>
      </li>
    );
  });

  return (
    <div className="category-container d-flex-fd-column">
      <h4>{props.heading}</h4>
      <ul>{list}</ul>
      <Link
        href={`/grid?name=${props.filterName}&heading=${props.heading}`}
        prefetch
        className="view-more-link"
      >
        View More
        <FaChevronRight size={14} />
      </Link>
    </div>
  );
}
