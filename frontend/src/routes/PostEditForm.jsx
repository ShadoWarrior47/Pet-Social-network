import React, { useState, useContext, useEffect } from "react";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import { useParams, useNavigate } from "react-router-dom";
import "./PostEditForm.css";

function PostEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentUserContext);
    console.log("Profile: currentUser from context =", currentUser);

    const [formData, setFormData] = useState({
        content: '',
        imageUrl: ''
    });

    const [formErrors, setFormErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch the post details when the component loads
    useEffect(() => {
        async function fetchPost() {
            try {
                const post = await PetApi.getPost(id); // Fetch post by ID
                setFormData({
                    content: post.content,
                    imageUrl: post.imageUrl,
                });
            } catch (err) {
                console.error("Error fetching post:", err);
                setFormErrors(["Could not load post details."]);
            }
        }

        fetchPost();
    }, [id]);


    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((data) => ({ ...data, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormErrors([]);
        setSuccessMessage("");

        try {
            await PetApi.updatePost(id, formData);
            setSuccessMessage("Post updated successfully!!");
            setTimeout(() => navigate(`/posts/${id}`), 2000);
        } catch (err) {
            console.error("Error updating post:", err);
            setFormErrors(['Failed to update post']);
            setSuccessMessage('');
        }
    };

    return (
        <div className="PostEditForm-container">
            <h1>Edit Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="content">Content :</label>
                    <input
                        id="content"
                        name="content"
                        type="text"
                        value={formData.content || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="imageUrl">Image Url :</label>
                    <textarea
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl || ""}
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

                <button type="submit">Update Post</button>

            </form>
        </div>
    );

}

export default PostEditForm;
