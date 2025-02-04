import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PetNewForm from "./PetNewForm";
import { vi } from "vitest";

it("renders without crashing", function () {
    render(
        <MemoryRouter>
            <PetNewForm createPet={() => { }} currentUser={{ id: 1, username: "testuser" }} />
        </MemoryRouter>
    );
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <PetNewForm createPet={() => { }} currentUser={{ id: 1, username: "testuser" }} />
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

it("calls createPet function on form submission", async function () {
    const createPetMock = vi.fn();
    const { getByLabelText, getByText } = render(
        <MemoryRouter>
            <PetNewForm createPet={createPetMock} currentUser={{ id: 1, username: "testuser" }} />
        </MemoryRouter>
    );

    // Select form inputs
    const nameInput = getByLabelText("Name:");
    const typeInput = getByLabelText("Type:");
    const breedInput = getByLabelText("Breed:");
    const ageInput = getByLabelText("Age:");
    const bioInput = getByLabelText("Bio:");
    const photoUrlInput = getByLabelText("Photo URL:");
    const submitButton = getByText("Add Pet");

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: "Buddy" } });
    fireEvent.change(typeInput, { target: { value: "Dog" } });
    fireEvent.change(breedInput, { target: { value: "Golden Retriever" } });
    fireEvent.change(ageInput, { target: { value: "3" } });
    fireEvent.change(bioInput, { target: { value: "A friendly dog" } });
    fireEvent.change(photoUrlInput, { target: { value: "http://example.com/photo.jpg" } });

    // Submit the form
    fireEvent.click(submitButton);

    // Assert that createPet was called with correct data
    expect(createPetMock).toHaveBeenCalledWith({
        name: "Buddy",
        type: "Dog",
        breed: "Golden Retriever",
        age: 3,
        bio: "A friendly dog",
        photoUrl: "http://example.com/photo.jpg",
        ownerId: 1,
    });
});
