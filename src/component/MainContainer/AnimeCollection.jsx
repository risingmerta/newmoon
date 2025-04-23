"use client";
import React from "react";
import Card from "../Card/Card";
import "./main-container.css";
import Link from "next/link";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaChevronRight,
} from "react-icons/fa";

export default function AnimeCollection(props) {
  const handleNavigation = () => {};

  // Render cards based on data passed as props
  const cards = props?.data?.map((data) => (
    <Card
      key={props.datr === "yes" ? data.id : data.id}
      datr={props?.datr ? "yes" : ""}
      data={data}
      length={props.data.length}
      collectionName={props.collectionName}
      IsLoading={props.IsLoading}
      selectL={props.selectL}
      refer={props.refer}
    />
  ));

  // Pagination logic
  let useArr = [];
  const currentPage = parseInt(props.page) || 1;
  const totalPages = parseInt(props.totalPages) || 1;

  // Calculate pagination array
  if (totalPages <= 3) {
    useArr = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage < 3) {
    useArr = [1, 2, 3];
  } else if (currentPage >= totalPages - 1) {
    useArr = [totalPages - 2, totalPages - 1, totalPages];
  } else {
    useArr = [currentPage - 1, currentPage, currentPage + 1];
  }

  return (
    <>
      {props.data?.length < 6 && (
        <div className="header heddR heddN">
          <h2 className="header-title heddH2">
            {props.onSear ? (
              <>
                {props.collectionName} <i>{props.keyword}</i>
              </>
            ) : (
              props.collectionName
            )}
          </h2>

          {props.isInGrid ? null : (
            <Link
              href={`/grid?name=${props.filterName}&heading=${props.collectionName}&refer=${props.refer}`}
              className="view-more-link view-more-linkop"
              onClick={handleNavigation}
            >
              View More
              <FaChevronRight size={14} />
            </Link>
          )}
          {props.datr === "yes" ? (
            <div className="view-more-linkop">
              {props.totalDocs?.length > 0 ? props.totalDocs : null}
            </div>
          ) : null}
        </div>
      )}
      <div className="anime-collection-wrapper">
        {props.data?.length >= 6 && (
          <div className="header heddR">
            <h2 className="header-title heddH2">{props.collectionName}</h2>
            {props.isInGrid ? null : (
              <Link
                href={`/grid?name=${props.filterName}&heading=${props.collectionName}&refer=${props.refer}`}
                className="view-more-link view-more-linkop"
                onClick={handleNavigation}
              >
                View More
                <FaChevronRight size={14} />
              </Link>
            )}
            {props.datr === "yes" ? (
              <div className="view-more-linkop">{props.totalDocs}</div>
            ) : null}
          </div>
        )}

        <div className="card-wrapper d-flex a-center j-center">{cards}</div>

        {totalPages > 1 && (
          <div className="paginA">
            {currentPage > 1 && (
              <>
                <Link
                  href={
                    props.datr === "yes"
                      ? props.fullPath.replace(
                          /([?&])page=\d+(&?)/,
                          (_, first, second) =>
                            first === "?" && second ? "?" : first
                        )
                      : props.fiki
                      ? `/grid?name=${props.filterName}&heading=${props.collectionName}&refer=${props.refer}`
                      : `/genre?id=${props.filterName}&name=${props.filterName}&refer=${props.refer}`
                  }
                  className="pagin-tile"
                  onClick={handleNavigation}
                >
                  <FaAngleDoubleLeft />
                </Link>

                <Link
                  href={
                    props.datr === "yes"
                      ? props.fullPath.replace(
                          /([?&])page=\d+/,
                          `$1page=${currentPage - 1}`
                        )
                      : props.fiki
                      ? `/grid?name=${props.filterName}&heading=${
                          props.collectionName
                        }&page=${currentPage - 1}&refer=${props.refer}`
                      : `/genre?id=${props.filterName}&name=${
                          props.filterName
                        }&page=${currentPage - 1}&refer=${props.refer}`
                  }
                  className="pagin-tile"
                  onClick={handleNavigation}
                >
                  <FaAngleLeft />
                </Link>
              </>
            )}

            {useArr.map((ii) => (
              <Link
                key={ii}
                href={
                  props.datr === "yes"
                    ? props.fullPath.replace(/([?&])page=\d+/, `$1page=${ii}`)
                    : props.fiki
                    ? ii === 1
                      ? `/grid?name=${props.filterName}&heading=${props.collectionName}&refer=${props.refer}`
                      : `/grid?name=${props.filterName}&heading=${props.collectionName}&page=${ii}&refer=${props.refer}`
                    : ii === 1
                    ? `/genre?id=${props.filterName}&name=${props.filterName}&refer=${props.refer}`
                    : `/genre?id=${props.filterName}&name=${props.filterName}&page=${ii}&refer=${props.refer}`
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
                onClick={handleNavigation}
              >
                {ii}
              </Link>
            ))}

            {currentPage < totalPages && (
              <>
                <Link
                  href={
                    props.datr === "yes"
                      ? props.fullPath.replace(
                          /([?&])page=\d+/,
                          `$1page=${props.page ? currentPage + 1 : 2}&refer=${
                            props.refer
                          }`
                        )
                      : props.fiki
                      ? `/grid?name=${props.filterName}&heading=${
                          props.collectionName
                        }&page=${props.page ? currentPage + 1 : 2}&refer=${
                          props.refer
                        }`
                      : `/genre?id=${props.filterName}&name=${
                          props.filterName
                        }&page=${props.page ? currentPage + 1 : 2}&refer=${
                          props.refer
                        }`
                  }
                  className="pagin-tile"
                  onClick={handleNavigation}
                >
                  <FaAngleRight />
                </Link>

                <Link
                  href={
                    props.datr === "yes"
                      ? props.fullPath.replace(
                          /([?&])page=\d+/,
                          `$1page=${totalPages}`
                        )
                      : props.fiki
                      ? `/grid?name=${props.filterName}&heading=${props.collectionName}&page=${totalPages}&refer=${props.refer}`
                      : `/genre?id=${props.filterName}&name=${props.filterName}&page=${totalPages}&refer=${props.refer}`
                  }
                  className="pagin-tile"
                  onClick={handleNavigation}
                >
                  <FaAngleDoubleRight />
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
