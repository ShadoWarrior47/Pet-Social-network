import React, { useState, useContext, useEffect } from "react";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import { useParams } from "react-router-dom";
import "./ProfileEditForm.css";

function ProfileEditForm() {
    const { username } = useParams();
    const { currentUser, updateCurrentUser } = useContext(CurrentUserContext);

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        profilePic: '',
        email: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    // Update formData once currentUser is available
    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username || "",
                name: currentUser.name || "",
                profilePic: currentUser.profilePic || "",
                email: currentUser.email || "",
                password: ""
            });
        }
    }, [currentUser]);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((data) => ({ ...data, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!currentUser?.username) {
            setFormErrors(["User is not properly authenticated. Please log in again."]);
            return;
        }
        try {
            const updatedUser = await PetApi.updateUser(currentUser.username, {
                name: formData.name,
                profilePic: formData.profilePic,
                email: formData.email,
                password: formData.password
            });
            setSuccessMessage("Profile updated successfully!!");
            setFormErrors([]);
            updateCurrentUser(updatedUser);
        } catch (err) {
            setFormErrors(err);
            setSuccessMessage('');
        }
    }

    return (
        <div className="Profile-container">
            <h1>Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        value={formData.username}
                        autoComplete="new-username"
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="profilePic">Profile Picture Url</label>
                    <input
                        id="profilePic"
                        name="profilePic"
                        value={formData.profilePic}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        autoComplete="new-email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
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
                <button type="submit">Save Changes</button>

            </form>
        </div>
    )

}

export default ProfileEditForm;
