import React, { useState, useContext } from "react";
import { CurrentUserContext } from "../CurrentUserContext";
import MyPetList from "./MyPetList";
import MyPostList from "./MyPostList";
import { Link, useNavigate } from "react-router-dom";
import PetApi from "../PetApi";

import "./Profile.css";

function Profile({ loading }) {
    const { currentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    if (loading) {
        return <h1>Loading...</h1>;
    }

    const onDelete = async (username) => {
        const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");

        if (!confirmDelete) return;
        try {
            await PetApi.deleteUser(username); // Use the API method with username
            alert("Profile deleted successfully.");
            navigate("/"); // Redirect after successful deletion
        } catch (err) {
            console.error("Error deleting profile:", err);
            setError("Failed to delete profile. Please try again.");
        }
    };


    return (
        <div className="profile-container">
            <div className="message-box">
                <h2> {currentUser.username} Profile</h2>
                <>
                    <button>
                        <Link to={`/users/edit/${currentUser.username}`}>Edit Profile</Link>
                    </button>
                    <button onClick={() => onDelete(currentUser.username)}>Delete Profile</button>
                    {error && <div>{error}</div>}
                </>

            </div>

            <div className="content-layout">
                <div className="pets-section">

                    <MyPetList />
                </div>
                <div className="posts-section">
                    <MyPostList />
                </div>

            </div>
        </div>
    );
}

export default Profile;
