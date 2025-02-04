import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetApi from "../PetApi";
import "./PetNewForm.css";

function PetNewForm({ createPet, currentUser }) {
  const navigate = useNavigate();

  const INITIAL_STATE = {
    name: "",
    type: "",
    breed: "",
    age: "",
    bio: "",
    photoUrl: "",
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
    try {
      const petData = { ...formData, ownerId: currentUser.id, age: parseInt(formData.age, 10) || 0 };
      await createPet(petData); // `createPet` makes the API call
      navigate("/pets"); // Navigate to the pet listing or relevant page
    } catch (err) {
      console.error("Error creating pet:", err);
      alert("Failed to create pet. Please try again.");
    }
  };

  return (
    <div className="PetNewForm-container">
      <h1>Add a New Pet</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Pet's Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <input
            id="type"
            name="type"
            type="text"
            placeholder="Pet's Type (e.g., Dog, Cat)"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="breed">Breed:</label>
          <input
            id="breed"
            name="breed"
            type="text"
            placeholder="Pet's Breed"
            value={formData.breed}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            name="age"
            type="number"
            placeholder="Pet's Age"
            value={formData.age}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Tell us about your pet"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="photoUrl">Photo URL:</label>
          <input
            id="photoUrl"
            name="photoUrl"
            type="text"
            placeholder="Photo URL"
            value={formData.photoUrl}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
}

export default PetNewForm;
