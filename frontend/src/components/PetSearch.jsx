import React from "react";
import SearchBar from "../components/SearchBar"; // Import existing SearchBar
// import "./PetSearch.css";

function PetSearch({ filters, setFilters, types, breeds, setSearchTerms }) {
    // Handle dropdown changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
       setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
       setSearchTerms("");
    };

    return (
        <div className="PetSearch">
            {/* Search Bar */}
            <SearchBar setSearchTerms={setSearchTerms} />

            {/* Filters */}
            <form className="PetSearch-filters">
                <div>
                    <label htmlFor="type">Type:</label>
                    <select
                        id="type"
                        name="type"
                        value={filters.type}
                        onChange={handleInputChange}
                    >
                        <option value="">All</option>
                        {types.map((type, idx) => (
                            <option key={idx} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="breed">Breed:</label>
                    <select
                        id="breed"
                        name="breed"
                        value={filters.breed}
                        onChange={handleInputChange}
                    >
                        <option value="">All</option>
                        {breeds.map((breed, idx) => (
                            <option key={idx} value={breed}>
                                {breed}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
    );
}

export default PetSearch;
