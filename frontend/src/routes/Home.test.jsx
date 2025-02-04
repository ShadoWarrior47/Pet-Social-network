import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CurrentUserContext } from "../CurrentUserContext";
import Home from "./Home";
import '@testing-library/jest-dom';
import { vi } from "vitest";

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn().mockImplementation((success) =>
    Promise.resolve(
      success({
        coords: {
          latitude: 51.1,
          longitude: 45.3
        }
      })
    )
  )
};

global.navigator.geolocation = mockGeolocation;


describe("Home Component", () => {
  it("renders the loading state", () => {
    render(
      <MemoryRouter>
      <CurrentUserContext.Provider value={{ currentUser: null }}>
        <Home loading={true} />
      </CurrentUserContext.Provider>
    </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the guest view when no user is logged in", () => {
    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: null }}>
          <Home loading={false} />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    // expect(screen.getByText("PetLovers!")).toBeInTheDocument();
    expect(
      screen.getByText("Vibrant social networking platform where you can celebrate your passion for animals.")
    ).toBeInTheDocument();
    // expect(screen.getByText("Login")).toBeInTheDocument();
    // expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("renders the logged-in view with the user's name", () => {
    const mockUser = { username: "johndoe", name: "John" };

    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockUser }}>
          <Home loading={false} />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome back, johndoe!")).toBeInTheDocument();
  });

  it("updates from loading state to content", () => {
    const { rerender } = render(
        <MemoryRouter>
          <CurrentUserContext.Provider value={{ currentUser: null }}>
            <Home loading={true} />
          </CurrentUserContext.Provider>
        </MemoryRouter>
      );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    rerender(
        <MemoryRouter>
          <CurrentUserContext.Provider value={{ currentUser: null }}>
            <Home loading={false} />
          </CurrentUserContext.Provider>
        </MemoryRouter>
      );

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    // expect(screen.getByText("PetLovers!")).toBeInTheDocument();
    // expect(screen.getByText((content) => content.includes("PetLovers"))).toBeInTheDocument();

  });
});
