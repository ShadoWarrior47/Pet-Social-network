import React from "react";
import { Link } from "react-router-dom";
import "./Event.css";

function Event({ event, currentUser, onDelete }) {
  const isOwner = currentUser && currentUser.id === event.createdBy;


  return (
    <div className="event">
      <h3>
        <Link to={`/events/${event.id}`}>{event.title}</Link>
      </h3>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      {isOwner && (
        <div className="Event-actions">
            <Link className="btneditDelete btnEdit" to={`/events/edit/${event.id}`}>Edit</Link>
          <button className="btneditDelete btnDelete" onClick={() => onDelete(event.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Event;
