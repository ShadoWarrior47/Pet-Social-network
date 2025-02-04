import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SearchBar from "./SearchBar";
import '@testing-library/jest-dom';

describe("SearchBar Component", () => {
  test("renders input field and submit button", () => {
    const setSearchTerms = vi.fn();
    render(<SearchBar setSearchTerms={setSearchTerms} />);

    // Check if the input field is rendered
    const inputField = screen.getByPlaceholderText("Search..");
    expect(inputField).toBeInTheDocument();

    // Check if the submit button is rendered
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeInTheDocument();
  });

  test("updates input value on typing", () => {
    const setSearchTerms = vi.fn();
    render(<SearchBar setSearchTerms={setSearchTerms} />);

    const inputField = screen.getByPlaceholderText("Search..");

    // Simulate typing into the input field
    fireEvent.change(inputField, { target: { value: "test query" } });

    // Assert the input field reflects the typed value
    expect(inputField.value).toBe("test query");
  });

  test("calls setSearchTerms with the correct value on form submission", () => {
    const mockSetSearchTerms = vi.fn();
    render(<SearchBar setSearchTerms={mockSetSearchTerms} />);

    const inputField = screen.getByPlaceholderText("Search..");
    const submitButton = screen.getByRole('button');

    // Simulate typing into the input field
    fireEvent.change(inputField, { target: { value: "test query" } });

    // Simulate form submission
    fireEvent.submit(submitButton);

    // Assert the setSearchTerms function was called with the correct value
    expect(mockSetSearchTerms).toHaveBeenCalledWith({
      title: "test query",
      option: "0" // the default value set in your component
    });

    // Assert the input field is cleared after submission
    expect(inputField.value).toBe("");
  });

  test("renders and updates dropdown if showOptions is true", () => {
    const setSearchTerms = vi.fn();
    render(<SearchBar setSearchTerms={setSearchTerms} showOptions={true} />);

    const selectField = screen.getByDisplayValue("All");
    expect(selectField).toBeInTheDocument();

    // Change the dropdown value
    fireEvent.change(selectField, { target: { value: "1" } });
    expect(selectField.value).toBe("1");
  });
});
