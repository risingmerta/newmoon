import React from "react";
import Genre from "../Genre/Genre";
import TopTenAnime from "../TopTen/TopTenAnime";

export default function MainSidebar(props) {
  return (
    <div className="d-flex-fd-column">
      <Genre isInNavbar={false} data={props.data?.genres} IsLoading={props.IsLoading}/>
      <TopTenAnime data={props.data?.topTen} IsLoading={props.IsLoading} selectL={props.selectL}/>
    </div>
  );
}