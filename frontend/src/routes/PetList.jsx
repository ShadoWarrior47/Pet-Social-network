import React, { useEffect, useState, useContext } from "react";
import PetApi from "../PetApi";
import Pet from "../components/Pet";
import PetSearch from "../components/PetSearch";
import { CurrentUserContext } from "../CurrentUserContext";
import "./PetList.css";

function PetList() {
    const [pets, setPets] = useState([]);
    const [types, setTypes] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const { currentUser } = useContext(CurrentUserContext);
    const [filters, setFilters] = useState({
        name: "",
        type: "",
        breed: "",
    });
    const [searchTerms, setSearchTerms] = useState("");

    // Fetch distinct types on mount
    useEffect(() => {
        async function fetchTypes() {
            try {
                const fetchedTypes = await PetApi.getDistinctTypes();
                setTypes(fetchedTypes);
            } catch (err) {
                console.error("Error fetching types:", err);
            }
        }
        fetchTypes();
    }, []);

    // Fetch distinct breeds on mount
    useEffect(() => {
        async function fetchBreeds() {
            try {
                const fetchedBreeds = await PetApi.getDistinctBreeds();
                setBreeds(fetchedBreeds);
            } catch (err) {
                console.error("Error fetching breeds:", err);
            }
        }
        fetchBreeds();
    }, []);

    // Fetch pets whenever filters or search terms change
// useEffect(() => {
//     async function fetchPets() {
//         try {
//             // Assuming that 'searchTerms' now directly contains the string to be used as 'name'
//             const formattedFilters = {
//                 ...filters,
//                 name: searchTerms // Make sure 'searchTerms' is always a string
//             };

//             // Clean filters to ensure no empty values are sent
//             const cleanedFilters = Object.fromEntries(
//                 Object.entries(formattedFilters).filter(
//                     ([_, value]) => value && value.toString().trim() !== ""
//                 )
//             );

//             const fetchedPets = await PetApi.getPets(cleanedFilters);
//             setPets(fetchedPets);
//         } catch (err) {
//             console.error("Error fetching pets:", err);
//         }
//     }
//     fetchPets();
// }, [filters, searchTerms]);


    // Fetch pets whenever filters or search terms change
    useEffect(() => {
        async function fetchPets() {
            try {
                const cleanedFilters = Object.fromEntries(
                    Object.entries({ ...filters, name: searchTerms || '' }).filter(
                        ([_, value]) => value?.toString().trim() !== ""
                    )
                );

                const fetchedPets = await PetApi.getPets(cleanedFilters);
                setPets(fetchedPets);
            } catch (err) {
                console.error("Error fetching pets:", err);
            }
        }
        fetchPets();
    }, [filters, searchTerms]);

    const handleDelete = async (petId) => {
        try {
            await PetApi.deletePet(petId);
            setPets((pets) => pets.filter((pet) => pet.id !== petId));
        } catch (err) {
            console.error("Error deleting pet:", err);
        }
    };

    return (
        <div className="PetList">
            <h1>Pets</h1>

            {/* Use PetSearch for search and filters */}
            <PetSearch
                filters={filters}
                setFilters={setFilters}
                types={types}
                breeds={breeds}
                setSearchTerms={setSearchTerms}
            />

            <div className="PetList-grid">
                {pets.length > 0 ? (
                    pets.map((pet) => (
                        <Pet
                            pet={pet}
                            key={pet.id}
                            currentUser={currentUser}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p>No pets found</p>
                )}
            </div>
        </div>
    );
}

export default PetList;
