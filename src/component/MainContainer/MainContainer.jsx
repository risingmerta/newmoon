import Schedule from "../Schedule/Schedule";
import AnimeCollection from "./AnimeCollection";
import MainSidebar from "./MainSidebar";

export default function MainContainer(props) {
  return (
    <div className="main-container d-flex">
      <>
        {/* Sidebar */}
        <div className="sidebar-wrapper">
          <MainSidebar
            data={props.data} // Pass the sidebar data
            IsLoading={props.IsLoading}
            selectL={props.selectL}
          />
        </div>

        {/* Anime Collections */}
        <div className="collections-wrapper d-flex-fd-column a-center ">
          {/* Latest Episodes */}
          <AnimeCollection
            collectionName="Latest Episodes"
            data={props.data.latestEpisode.slice(0, 12)} // Use recentEpisodesAnime from props
            filterName="recently-updated"
            IsLoading={props.IsLoading}
            selectL={props.selectL}
          />

          {/* New on Animoon */}
          <AnimeCollection
            collectionName="New on Animoon"
            data={props.data.recentlyAdded.slice(0, 12)} // Use newAnime from props
            filterName="recently-added"
            IsLoading={props.IsLoading}
            selectL={props.selectL}
          />
          <div>
            <Schedule schedule={props.schedule} />
          </div>

          {/* Top Upcoming */}
          <AnimeCollection
            collectionName="Top Upcoming"
            data={props.data.topUpcoming.slice(0, 12)} // Use upcomingAnime from props
            filterName="top-upcoming"
            IsLoading={props.IsLoading}
            selectL={props.selectL}
          />
        </div>
      </>
    </div>
  );
}
