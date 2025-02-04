import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetApi from "../PetApi";
import "./PostNewForm.css";

function PostNewForm({ currentUser }) {
    const navigate = useNavigate();

    const INITIAL_STATE = {
        content: "",
        imageUrl: "",
    };

    const [formData, setFormData] = useState(INITIAL_STATE);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((formData) => ({
            ...formData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
        try {
            const postData = { ...formData, ownerId: currentUser.id };
            const createdPost = await PetApi.createPost(postData);

            if (createdPost && createdPost.id) {
                navigate(`/posts/${createdPost.id}`);
            } else {
                throw new Error("Post ID is missing in the response.");
            }
        } catch (err) {
            console.error("Error creating post:", err);
            alert("Failed to create post. Please try again.");
        }
    };

    return (
        <div className="PostNewForm-container">
            <h1>Add a New Post</h1>
            <form onSubmit={handleSubmit} role="form">
                <div>
                    <label htmlFor="content">Content :</label>
                    <input
                        id="content"
                        name="content"
                        type="text"
                        placeholder="Content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="imageUrl">Image URL :</label>
                    <input
                        id="imageUrl"
                        name="imageUrl"
                        type="text"
                        placeholder="Image URL"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Add Post</button>
            </form>
        </div>
    );
}

export default PostNewForm;
