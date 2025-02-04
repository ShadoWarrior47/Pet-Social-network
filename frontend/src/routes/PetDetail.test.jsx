import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import PetDetail from "./PetDetail";
import { CurrentUserContext } from "../CurrentUserContext";
import PetApi from "../PetApi";
import '@testing-library/jest-dom';


// Mock PetApi to simulate API responses
vi.mock("../PetApi");

const testPet = {
  id: 1,
  name: "Fluffy",
  type: "Dog",
  breed: "Golden Retriever",
  age: 3,
  bio: "A friendly and playful dog.",
  photoUrl: "https://example.com/fluffy.jpg",
};

describe("PetDetail Component", () => {
  it("renders without crashing", async () => {
    PetApi.getPet.mockResolvedValue(testPet);

    render(
      <MemoryRouter initialEntries={["/pets/1"]}>
        <Routes>
          <Route
            path="/pets/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser: { id: 123 } }}>
                <PetDetail />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Fluffy")).toBeInTheDocument();
  });

  it("matches snapshot", async () => {
    PetApi.getPet.mockResolvedValue(testPet);

    const { asFragment } = render(
      <MemoryRouter initialEntries={["/pets/1"]}>
        <Routes>
          <Route
            path="/pets/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser: { id: 123 } }}>
                <PetDetail />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.findByText("Fluffy"));
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays pet details correctly", async () => {
    PetApi.getPet.mockResolvedValue(testPet);

    render(
      <MemoryRouter initialEntries={["/pets/1"]}>
        <Routes>
          <Route
            path="/pets/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser: { id: 123 } }}>
                <PetDetail />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Fluffy")).toBeInTheDocument();
    expect(screen.getByText("Type: Dog")).toBeInTheDocument();
    expect(screen.getByText("Breed: Golden Retriever")).toBeInTheDocument();
    expect(screen.getByText("Age: 3")).toBeInTheDocument();
    // expect(screen.getByText("A friendly and playful dog.")).toBeInTheDocument();
    expect(screen.getByText(/A friendly and playful dog\./i)).toBeInTheDocument();
    expect(screen.getByAltText("Fluffy")).toHaveAttribute("src", "https://example.com/fluffy.jpg");
  });

  it("handles loading state", () => {
    render(
      <MemoryRouter initialEntries={["/pets/1"]}>
        <Routes>
          <Route
            path="/pets/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser: { id: 123 } }}>
                <PetDetail />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles pet not found", async () => {
    PetApi.getPet.mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={["/pets/1"]}>
        <Routes>
          <Route
            path="/pets/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser: { id: 123 } }}>
                <PetDetail />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Pet not found!")).toBeInTheDocument();
  });
});
