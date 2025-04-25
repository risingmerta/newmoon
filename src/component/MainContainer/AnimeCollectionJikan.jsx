import React from "react";
import Card from "../Card/CardJikan";
import "./main-container.css";
import Link from "next/link";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

export default function AnimeCollection(props) {
  const handleNavigation = (data) => {
  };

  function getAlphabets() {
    const alphabets = [];
    const startChar = "A".charCodeAt(0);
    const endChar = "Z".charCodeAt(0);
    for (let i = startChar; i <= endChar; i++) {
      alphabets.push(String.fromCharCode(i));
    }
    const links = alphabets.map((el) => {
      return (
        <Link
          href={`/a-z/alpha?sort=${el}${props.refer?'?refer'=props.refer:''}`}
          key={el}
          onClick={props.sort === el ? "" : handleNavigation}
          className={`alphabet-jile ${
            props.sort === el ? "alpha-selected" : ""
          }`}
        >
          {el}
        </Link>
      );
    });
    return [...links];
  }

  const links = getAlphabets();

  const cards = props?.data.data?.map((data, idx) => {
    return (
      <Card
        key={data.data_id}
        data={data}
        selectL={props.selectL}
        collectionName={props.collectionName}
        IsLoading={props.IsLoading}
        refer={props.refer}
      />
    );
  });

  let useArr = [];
  if (props.page) {
    if (parseInt(props.page) >= 3) {
      useArr = [
        parseInt(props.page) - 2,
        parseInt(props.page) - 1,
        parseInt(props.page),
        parseInt(props.page) + 1,
        parseInt(props.page) + 2,
      ];
    }
    if (parseInt(props.page) < 3) {
      useArr = [1, 2, 3];
    }
    if (parseInt(props.page) >= parseInt(props.totalPages) - 2) {
      useArr = [
        parseInt(props.totalPages) - 2,
        parseInt(props.totalPages) - 1,
        parseInt(props.totalPages),
      ];
    }
    if (parseInt(props.page) < parseInt(props.totalPages) - 2) {
      useArr = [
        parseInt(props.page) - 2,
        parseInt(props.page) - 1,
        parseInt(props.page),
        parseInt(props.page) + 1,
        parseInt(props.page) + 2,
      ];
    }
  } else {
    useArr = [1, 2, 3];
  }
  if (parseInt(props.page) === 2) {
    useArr = [1, 2, 3];
  }

  return (
    <div className="anime-collection-wrapper">
      <div className="backI">
        <Link href={`/${props.refer?'?refer'=props.refer:''}`} onClick={handleNavigation} className="homiK">
          Home
        </Link>
        <div className="colY">&#x2022;</div>
        <div className="colY">A-Z List</div>
      </div>
      <div className="heddR">
        <h2 className="heddH9">{props.collectionName}</h2>{" "}
      </div>
      <div className="alphabet-jist d-flex">
        <Link href={`/a-z/all${props.refer?'?refer'=props.refer:''}`} onClick={props.sort ? handleNavigation : ""}>
          <div
            className={`alphabet-jile ${props.sort ? "" : "alpha-selected"}`}
          >
            All
          </div>
        </Link>
        <Link
          href={`/a-z/other?sort=other${props.refer?'?refer'=props.refer:''}`}
          onClick={props.sort === "other" ? "" : handleNavigation}
        >
          <div
            className={`alphabet-jile ${
              props.sort === "other" ? "alpha-selected" : ""
            }`}
          >
            #
          </div>
        </Link>
        <Link
          href={`/a-z/0-9?sort=0-9${props.refer?'?refer'=props.refer:''}`}
          onClick={props.sort === "0-9" ? "" : handleNavigation}
        >
          <div
            className={`alphabet-jile ${
              props.sort === "0-9" ? "alpha-selected" : ""
            }`}
          >
            0-9
          </div>
        </Link>
        {links}
      </div>

      <div className="card-wrapper d-flex a-center j-center"> {cards}</div>
      {props.totalPages > 1 ? (
        <div className="paginA">
          {props.page ? (
            <Link
              href={
                props.sort
                  ? `/a-z/${props.para}?sort=${props.sort}${props.refer?'?refer'=props.refer:''}`
                  : `/a-z/${props.para}${props.refer?'?refer'=props.refer:''}`
              }
              onClick={handleNavigation}
              className="pagin-tile"
            >
              <FaAngleDoubleLeft />
            </Link>
          ) : (
            ""
          )}
          {props.page ? (
            <Link
              href={
                props.sort
                  ? `/a-z/${props.para}?sort=${props.sort}&page=${
                      parseInt(props.page) - 1
                    }${props.refer?'?refer'=props.refer:''}`
                  : `/a-z/${props.para}?page=${parseInt(props.page) - 1}${props.refer?'?refer'=props.refer:''}`
              }
              onClick={handleNavigation}
              className="pagin-tile"
            >
              <FaAngleLeft />
            </Link>
          ) : (
            ""
          )}
          {useArr.map((ii) => (
            <Link
              href={
                props.sort
                  ? ii === 1
                    ? `/a-z/${props.para}?sort=${props.sort}${props.refer?'?refer'=props.refer:''}`
                    : `/a-z/${props.para}?sort=${props.sort}&page=${ii}${props.refer?'?refer'=props.refer:''}`
                  : ii === 1
                  ? `/a-z/all?${props.refer?'?refer'=props.refer:''}`
                  : `/a-z/all?page=${ii}${props.refer?'?refer'=props.refer:''}`
              }
              onClick={
                props.page
                  ? ii === parseInt(props.page)
                    ? ""
                    : handleNavigation
                  : ii === 1
                  ? ""
                  : handleNavigation
              }
              className={`pagin-tile ${
                props.page
                  ? ii === parseInt(props.page)
                    ? "pagin-colo"
                    : ""
                  : ii === 1
                  ? "pagin-colo"
                  : ""
              }`}
            >
              {ii}
            </Link>
          ))}
          {parseInt(props.page) !== props.totalPages ? (
            <Link
              href={
                props.sort
                  ? `/a-z/${props.para}?sort=${props.sort}&page=${
                      props.page ? parseInt(props.page) + 1 : 2
                    }${props.refer?'?refer'=props.refer:''}`
                  : `/a-z/${props.para}?page=${
                      props.page ? parseInt(props.page) + 1 : 2
                    }${props.refer?'?refer'=props.refer:''}`
              }
              onClick={handleNavigation}
              className="pagin-tile"
            >
              <FaAngleRight />
            </Link>
          ) : (
            ""
          )}
          {parseInt(props.page) !== props.totalPages ? (
            <Link
              href={
                props.sort
                  ? `/a-z/${props.para}?sort=${props.sort}&page=${props.totalPages}${props.refer?'?refer'=props.refer:''}`
                  : `/a-z/${props.para}?page=${props.totalPages}${props.refer?'?refer'=props.refer:''}`
              }
              onClick={handleNavigation}
              className="pagin-tile"
            >
              <FaAngleDoubleRight />
            </Link>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
