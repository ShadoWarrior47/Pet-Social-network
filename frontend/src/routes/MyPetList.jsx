import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../CurrentUserContext";
import PetApi from "../PetApi";
import Pet from "../components/Pet";
import "./MyPetList.css";

function MyPetList() {
  const [pets, setPets] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  const [searchTerms, setSearchTerms] = useState("");

  // Fetch user's pets whenever filters or search terms change
  useEffect(() => {
    async function fetchUserPets() {
      if (!currentUser) return;
      try {
        const fetchedPets = await PetApi.getUserPets(currentUser.username);
        setPets(fetchedPets);
      } catch (err) {
        console.error("Error fetching user pets:", err);
      }
    }
    fetchUserPets();
  }, [currentUser]);


  const handleDelete = async (petId) => {
    try {
      await PetApi.deletePet(petId);
      setPets((pets) => pets.filter((pet) => pet.id !== petId));
    } catch (err) {
      console.error("Error deleting pet:", err);
    }
  };

  return (
    <div className="MyPetList">
      <h1>My Pets</h1>

      {currentUser && (
        <div className="CreatePet-btn">
          <button>
            <Link to="/pets/new">Create Pet</Link>
          </button>
        </div>
      )}

      <div className="MyPetList-grid">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <Pet
              key={pet.id}
              pet={pet}
              currentUser={currentUser}
              onDelete={handleDelete}
              isMyPet={true}
            />
          ))
        ) : (
          <p>No pets found</p>
        )}
      </div>
    </div>
  );
}

export default MyPetList;
