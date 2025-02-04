import React, { useState,useEffect } from "react";
import "./SearchBar.css";

function SearchBar({ setSearchTerms, showOptions = false }) {
  const [inputValue, setInputValue] = useState("");
  const [userSearchOption, setUserSearchOption] = useState("0");

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "searchInput") {
      setInputValue(value);
    }
    else if (name === "ddlsearchOption") {
      setUserSearchOption(value);
    } else {

    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  
    setSearchTerms({
      title: inputValue,
      option: userSearchOption
    });
  
    setInputValue("");
    setUserSearchOption("0");
  }
  
  

  return (
    <div className="SearchBar-container">
      <form onSubmit={handleSubmit}>
        <select name="ddlsearchOption" value={userSearchOption} onChange={handleChange} style={{ display: showOptions ? 'block' : 'none' }} >
          <option value="0">All</option>
          <option value="1">By Title</option>
          <option value="2">By Location</option>
          {/* <option value="3">By Date</option> */}
        </select>
        <input name="searchInput"
          type="text"
          placeholder="Search.."
          value={inputValue}
          onChange={handleChange}
        />
        <button type="submit">
          <i className="fa fa-search"></i>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;