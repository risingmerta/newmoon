"use client";
import React, { useState, useEffect } from "react";
import "./NavCss/searchInput.css";
import { FaAngleRight, FaFilter, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SearchInput = (props) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [data, setData] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value.length > 0) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/search?keyword=${value}`);
          const result = await response.json();

          if (response.ok) {
            setData(result); // Set the response data from MongoDB
          } else {
            setData(null);
            console.error(result.message);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    } else {
      setData(null);
    }
  }, [value]);

  const handleSearch = () => {
    if (value) {
      router.push(`/search?keyword=${value}&refer=${props.refer}`);
      // setSearchForm({ name: "" });
    }
  };

  const handleEnterPress = (e) => {
    if ((e.key === "Enter" || e.key === "Next") && value) {
      e.preventDefault(); // Prevent default behavior
      handleSearch();
    }
  };

  return (
    <>
      {props.float ? (
        <div className="search-container">
          <div className="common-wealth">
            <Link href={`/filter?refer=${props.refer}`} className="filter-ico">
              <FaFilter />
            </Link>
            <div className="float-bloc">
              <div className="Input-text">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleEnterPress}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 300)} // Slight delay for clicking dropdown
                  placeholder="Search anime..."
                />
              </div>
              <div className="flit">
                <Link href={`/search?keyword=${value}&refer=${props.refer}`}>
                  <FaSearch />
                </Link>
                {!props.float && (
                  <Link href={`/filter?refer=${props.refer}`} className="filter-btn">
                    Filter
                  </Link>
                )}
              </div>
            </div>
          </div>
          {isFocused && data && value && (
            <div className="dropdown">
              {data.map((item) => (
                <Link
                  href={`/${item.id}?refer=${props.refer}`}
                  key={item.id}
                  className="dropdown-item"
                >
                  <img
                    src={item.imgData}
                    alt={item.title}
                    className="dropdown-img"
                  />
                  <div className="dropdown-info">
                    <h4 className="titlel">
                      {item.title.length > 35
                        ? item.title.slice(0, 35) + "..."
                        : item.title}
                    </h4>
                    <p>
                      {item.japanese_title.length > 40
                        ? item.japanese_title.slice(0, 40) + "..."
                        : item.japanese_title}
                    </p>
                    <div className="tag-all">
                      <div>{item.releaseDate}</div>
                      <div className="dotol">&#x2022;</div>
                      <div className="showt">{item.showType}</div>
                      <div className="dotol">&#x2022;</div>
                      <div>{item.duration}</div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href={`/search?keyword=${value}&refer=${props.refer}`} className="allR">
                {" "}
                <div>View all results</div>
                <div>
                  <FaAngleRight />
                </div>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="search-container">
          <div className="Input-bloc">
            <div className="Input-text">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleEnterPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Slight delay for clicking dropdown
                placeholder="Search anime..."
              />
            </div>
            <div className="flit">
              <Link href={`/search?keyword=${value}&refer=${props.refer}`}>
                <FaSearch />
              </Link>
              {!props.float && (
                <Link href={`/filter?refer=${props.refer}`} className="filter-btn">
                  Filter
                </Link>
              )}
            </div>
          </div>
          {isFocused && data && value && (
            <div className="dropdown">
              {data.map((item) => (
                <Link
                  href={`/${item.id}?refer=${props.refer}`}
                  key={item.id}
                  className="dropdown-item"
                >
                  <img
                    src={item.imgData}
                    alt={item.title}
                    className="dropdown-img"
                  />
                  <div className="dropdown-info">
                    <h4 className="titlel">
                      {item.title.length > 35
                        ? item.title.slice(0, 35) + "..."
                        : item.title}
                    </h4>
                    <p>
                      {item.japanese_title.length > 40
                        ? item.japanese_title.slice(0, 40) + "..."
                        : item.japanese_title}
                    </p>
                    <div className="tag-all">
                      <div>{item.releaseDate}</div>
                      <div className="dotol">&#x2022;</div>
                      <div className="showt">{item.showType}</div>
                      <div className="dotol">&#x2022;</div>
                      <div>{item.duration}</div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href={`/search?keyword=${value}&refer=${props.refer}`} className="allR">
                {" "}
                <div>View all results</div>
                <div>
                  <FaAngleRight />
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchInput;
