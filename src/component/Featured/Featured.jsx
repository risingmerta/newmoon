import React from "react";
import ContentList from "./ContentList";

export default function Featured(props) {
  return (
    <div className="featured-container d-flex">
      <ContentList
        heading="Top Airing"
        data={props.data.topAiring.slice(0, 5)}
        selectL={props.selectL}
        filterName="top-airing"
        refer={props.refer}
      />
      <ContentList
        heading="Most Popular"
        data={props.data.mostPopular.slice(0, 5)}
        selectL={props.selectL}
        filterName="most-popular"
        refer={props.refer}
      />
      <ContentList
        heading="Most Favorite"
        data={props.data.mostFavorite.slice(0, 5)}
        selectL={props.selectL}
        filterName="most-favorite"
        refer={props.refer}
      />
      <ContentList
        heading="Latest Completed"
        data={props.data.latestCompleted.slice(0, 5)}
        selectL={props.selectL}
        filterName="completed"
        refer={props.refer}
      />
    </div>
  );
}
