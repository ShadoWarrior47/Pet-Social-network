import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PetList from "./PetList";
import PetApi from "../PetApi";
import { vi } from "vitest";
import { CurrentUserContext } from "../CurrentUserContext";
import '@testing-library/jest-dom';

// Mock the PetApi
vi.mock("../PetApi");

const mockPets = [
  { id: 10, name: "Pet One", type: "Dog" },
  { id: 11, name: "pet Two", type: "Cat" },
];

describe("PetList Component", () => {
  it("renders without crashing", () => {
    PetApi.getPets.mockResolvedValue(mockPets);

    render(
      <CurrentUserContext.Provider value={{ currentUser: { id: 1, username: "testuser" } }}>
        <PetList />
      </CurrentUserContext.Provider>
    );

    expect(screen.getByText("No pets found")).toBeInTheDocument();
  });

 
});
