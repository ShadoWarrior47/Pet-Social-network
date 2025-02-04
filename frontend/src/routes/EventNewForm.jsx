import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetApi from "../PetApi";
import "./EventNewForm.css";
import { useLoadScript, Autocomplete, LoadScript } from '@react-google-maps/api';

const libraries = ['places'];

function EventNewForm({ currentUser }) {
    const navigate = useNavigate();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const INITIAL_STATE = {
        title: "",
        description: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        lat: null,
        lng: null
    };

    const [formData, setFormData] = useState(INITIAL_STATE);

    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((formData) => ({
            ...formData,
            [name]: value,
        }));
    };

    const handleSelect = async (value) => {
        // Update the location in the form data
        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
        placesService.findPlaceFromQuery({
            query: value,
            fields: ['geometry'],
        }, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
                setFormData({
                    ...formData,
                    location: value,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                });
            } else {
                setErrorMsg('Location not found. Please enter a valid address.');
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("You need to be logged in to create an event.");
            return;
        }

        try {
            const eventData = { ...formData, createdBy: currentUser.id };

            if (eventData.startTime >= eventData.endTime) {
                alert("Event End Time must be after Start Time. ");
                throw new Error("Event End Time must be after Start Time. ");
            }
            const createdEvent = await PetApi.createEvent(eventData);

            if (createdEvent && createdEvent.id) {
                navigate(`/events/${createdEvent.id}`);
            } else {
                throw new Error("Event ID is missing in the response.");
            }
        } catch (err) {
            console.error("Error creating event:", err);
            setErrorMsg("Failed to create event. Please try again.");
        }
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="EventNewForm-container">
            <h1>Add a New Event</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title :</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description :</label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="location">Location :</label>
                    <Autocomplete
                        onLoad={autocomplete => {
                            autocomplete.addListener("place_changed", () => {
                                const place = autocomplete.getPlace();
                                handleSelect(place.formatted_address);
                            });
                        }}
                    >
                        <input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                            onBlur={handleChange}
                            required
                        />
                    </Autocomplete>
                </div>
                <div>
                    <label htmlFor="date">Date :</label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        placeholder="Date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="startTime">Start Time :</label>
                    <input
                        id="startTime"
                        name="startTime"
                        type="time"
                        placeholder="Start Time"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endTime">End Time :</label>
                    <input
                        id="endTime"
                        name="endTime"
                        type="time"
                        placeholder="End Time"
                        value={formData.endTime}
                        onChange={handleChange}
                    />
                </div>
                {errorMsg && <p>{errorMsg}</p>}

                <button type="submit">Add Event</button>
            </form>
        </div>
    );
}

export default EventNewForm;



