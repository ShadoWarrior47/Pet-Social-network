import React from "react";
import { Link } from "react-router-dom";
import "./Pet.css";

function Pet({ pet, onDelete, isMyPet = false }) {

    return (
        
            <div className="Pet">
                <h3><Link to={`/pets/${pet.id}`}>{pet.name}</Link></h3>
                <img src={pet.photoUrl} alt={pet.name} />
                
                {/* <p>{pet.type}</p>
            <p>Breed: {pet.breed}</p>
            <p>{pet.age} years old</p>
            <p>{pet.bio}</p> */}

            {isMyPet && (
                <>
                    <button>
                        <Link to={`/pets/edit/${pet.id}`}>Edit</Link>
                    </button>
                    <button onClick={() => onDelete(pet.id)}>Delete</button>
                </>
            )}
            </div>


    );
}

export default Pet;