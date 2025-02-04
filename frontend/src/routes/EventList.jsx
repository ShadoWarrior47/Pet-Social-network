import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import Event from "../components/Event";
import SearchBar from "../components/SearchBar";
import "./EventList.css";

const GOOGLE_AUTH_URL = "http://localhost:3001/auth/google";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  const [filters, setFilters] = useState({
    createdBy: "",
    title: "",
    startDate: "",
    endDate: "",
    latitude: null,
    longitude: null,
  });
  const [searchTerms, setSearchTerms] = useState({ title: "", option: "0" });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setFilters(f => ({
          ...f,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      },
      function (error) {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const cleanedFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => {
            return typeof value === 'string' ? value.trim() !== "" : value != null;
          })
        );

        // Include the search term in the filters
        const finalFilters = {
          ...cleanedFilters,
          title: searchTerms.title?.trim() || "",
          option: searchTerms.option?.trim() || "0"
        };

        const fetchedEvents = await PetApi.getEvents(finalFilters);
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }

    if (filters.latitude && filters.longitude) {
      fetchEvents();
    }
  }, [filters, searchTerms]);

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleDelete = async (eventId) => {
    try {
      await PetApi.deleteEvent(eventId);
      setEvents((events) => events.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };


  return (
    <div className="EventList">
      <h1>Events</h1>

      {currentUser && (
        <div className="newEvent">
          <Link to="/events/new">Create Event</Link>
        </div>
      )}

      <SearchBar setSearchTerms={setSearchTerms} showOptions={true} />
      <form>

        <div>
          <label htmlFor="startDate">From :</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="endDate">To :</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleInputChange}
          />
        </div>

      </form>
      <div>
        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          events.map((event) => (
            <Event
              key={event.id}
              event={event}
              currentUser={currentUser}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
