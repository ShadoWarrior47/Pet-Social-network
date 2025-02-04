import React, { useContext } from "react";
import { CurrentUserContext } from "../CurrentUserContext";
import EventList from "./EventList";
import PostList from "./PostList";
import PetNewsList from "./PetNewsList";
import "./Home.css";

function Home({ loading }) {
  const { currentUser } = useContext(CurrentUserContext);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="home-container">
      <div className="message-box">
        {currentUser ? (
          <h2>Welcome back, {currentUser.username}!</h2>
        ) : (
          <h2>Vibrant social networking platform where you can celebrate your passion for animals.</h2>
        )}
      </div>

      <div className="content-layout">
        <div className="events-section">
          <EventList />
        </div>
        <div className="posts-section">
          <PostList />
        </div>
        <div className="news-section">
          <PetNewsList />
        </div>
      </div>
    </div>
  );
}

export default Home;
