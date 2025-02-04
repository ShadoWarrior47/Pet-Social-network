import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import Profile from "./Profile";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import "@testing-library/jest-dom";

// mock PetApi with both default and named exports if necessary
vi.mock("../PetApi", () => ({
    __esModule: true, 
    default: {
      getUserPosts: vi.fn(),
      deleteUser: vi.fn(),
    },
  }));

describe("Profile Component", () => {
  const mockCurrentUser = {
    username: "testuser",
  };

  beforeEach(() => {
    PetApi.deleteUser.mockClear();
  });

  it("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <Profile loading={true} />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders profile details correctly", () => {
    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <Profile loading={false} />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(`${mockCurrentUser.username} Profile`)).toBeInTheDocument();
    expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
    expect(screen.getByText(/delete profile/i)).toBeInTheDocument();
  });

  it("handles user profile deletion", async () => {
    window.confirm = vi.fn(() => true); 
    PetApi.deleteUser.mockResolvedValueOnce({}); 

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/profile" element={
            <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
              <Profile loading={false} />
            </CurrentUserContext.Provider>
          } />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/delete profile/i));

    await waitFor(() => {
      expect(PetApi.deleteUser).toHaveBeenCalledWith(mockCurrentUser.username);
      expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete your profile? This action cannot be undone.");
    });
  });

});
