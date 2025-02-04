import React, { useState, useContext, useEffect } from "react";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import { useParams, useNavigate } from "react-router-dom";
import "./EventEditForm.css";

function EventEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentUserContext);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        startTime: '',
        endTime: ''
    });

    const [formErrors, setFormErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch the event details when the component loads
    useEffect(() => {
        async function fetchEvent() {
            try {
                const event = await PetApi.getEvent(id); // Fetch event by ID
                setFormData({
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    date: event.date.split("T")[0],
                    startTime: event.startTime,
                    endTime: event.endTime,
                });
            } catch (err) {
                console.error("Error fetching event:", err);
                setFormErrors(["Could not load event details."]);
            }
        }

        fetchEvent();
    }, [id]);


    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((data) => ({ ...data, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormErrors([]);
        setSuccessMessage("");

        // Basic validation check
        if (!formData.title || !formData.description || !formData.location || !formData.date || !formData.startTime || !formData.endTime) {
            setFormErrors(['Please fill out all required fields.']);
            return;
        }

        try {
            await PetApi.updateEvent(id, formData);
            setSuccessMessage("Event updated successfully!!");
            navigate(`/events/${id}`);
        } catch (err) {
            console.error("Error updating event:", err);
            setFormErrors(['Please fill out all required fields.']);
            setSuccessMessage('');
        }
    };

    return (
        <div className="EventEditForm-container">
            <h1>Edit Event</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title :</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="startTime">Start Time:</label>
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="endTime">End Time:</label>
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                {formErrors.length > 0 && (
                    <div className="errors">
                        {formErrors.map((err) => (
                            <p key={err}>{err}</p>
                        ))}
                    </div>
                )}

                {successMessage && <div className="success">{successMessage}</div>}

                <button type="submit">Update Event</button>

            </form>
        </div>
    );

}

export default EventEditForm;
