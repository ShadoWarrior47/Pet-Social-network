import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MyPetList from "./MyPetList";
import { vi } from "vitest";
import { CurrentUserContext } from "../CurrentUserContext";
import { MemoryRouter } from "react-router-dom";
import PetApi from "../PetApi";
import '@testing-library/jest-dom';

vi.mock("../PetApi", () => {
  return {
    __esModule: true,
    default: {
      getUserPets: vi.fn().mockResolvedValue([
        { id: 1, name: "Rex", type: "Dog" },
        { id: 2, name: "Whiskers", type: "Cat" },
      ]),
      deletePet: vi.fn(),
    },
  };
});

describe("MyPetList Component", () => {
  const mockCurrentUser = { id: 1, username: "testuser" };

  it("renders without crashing", async () => {
    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <MyPetList />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Rex/i)).toBeInTheDocument();
  });

  it("displays a message if no pets are found", async () => {
    PetApi.getUserPets.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <MyPetList />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );
    expect(await screen.findByText(/No pets found/i)).toBeInTheDocument();
  });

  it("correctly handles deletion of a pet", async () => {
    const petToDelete = { id: 1, name: "Rex", type: "Dog" };
    PetApi.deletePet.mockResolvedValueOnce({});
    PetApi.getUserPets.mockResolvedValueOnce([petToDelete]);
    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <MyPetList />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );
    expect(await screen.findByText(petToDelete.name)).toBeInTheDocument();

    PetApi.getUserPets.mockResolvedValueOnce([]); // Simulate the state after deletion
    fireEvent.click(screen.getByText(/Delete/i));
    expect(PetApi.deletePet).toHaveBeenCalledWith(petToDelete.id);
    expect(await screen.findByText(/No pets found/i)).toBeInTheDocument();
  });
});
