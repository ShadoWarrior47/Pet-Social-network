import React, { useState, useContext, useEffect } from "react";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import { useParams, useNavigate } from "react-router-dom";
import "./PetEditForm.css";
import Pet from "../components/Pet";

function PetEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentUserContext);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        breed: '',
        age: '',
        bio: '',
        photoUrl: ''
    });

    const [formErrors, setFormErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch the pet details when the component loads
    useEffect(() => {
        async function fetchPet() {
            try {
                const pet = await PetApi.getPet(id); // Fetch pet by ID
                console.log("Fetched Pet Data:", pet);
                setFormData({
                    name: pet.name || '',
                    type: pet.type || '',
                    breed: pet.breed || '',
                    age: pet.age || '',
                    bio: pet.bio || '',
                    photoUrl: pet.photoUrl || '',
                });
            } catch (err) {
                console.error("Error fetching pet:", err);
                setFormErrors(["Could not load pet details."]);
            }
        }

        fetchPet();
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
            await PetApi.updatePet(id, formData);
            setSuccessMessage("Pet updated successfully!!");
            setTimeout(() => navigate(`/pets/${id}`), 2000);
        } catch (err) {
            console.error("Error updating pet:", err);
            setFormErrors(err);
            setSuccessMessage('');
        }
    };

    return (
        <div className="PetEditForm-container">
            <h1>Edit pet</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name :</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="type">Type :</label>
                    <textarea
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="breed">Breed :</label>
                    <input
                        type="text"
                        id="breed"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="age">Age :</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="bio">Bio :</label>
                    <input
                        type="text"
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="photoUrl">Photo Url :</label>
                    <input
                        type="text"
                        id="photoUrl"
                        name="photoUrl"
                        value={formData.photoUrl}
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

                <button type="submit">Update Pet</button>

            </form>
        </div>
    );

}

export default PetEditForm;
