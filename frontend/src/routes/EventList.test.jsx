import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EventList from "./EventList";
import { vi } from "vitest";
import { CurrentUserContext } from "../CurrentUserContext";
import { MemoryRouter } from "react-router-dom";
import PetApi from "../PetApi";
import '@testing-library/jest-dom';

vi.mock("../PetApi", () => {
    return {
      __esModule: true, // <-- helps ensure ES module compatibility
      default: {
        getEvents: vi.fn().mockResolvedValue([
          { id: 1, title: "Event 1", location: "Place 1", date: "2025-01-10" },
          { id: 2, title: "Event 2", location: "Place 2", date: "2025-01-11" },
        ]),
        deleteEvent: vi.fn(),
      },
    };
  });

  // Mocking geolocation
global.navigator.geolocation = {
  getCurrentPosition: vi.fn().mockImplementation((success, error) => {
    return success({
      coords: {
        latitude: 34.0522,
        longitude: -118.2437
      }
    });
  })
};
  

describe("EventList Component", () => {
    const mockCurrentUser = { id: 1, username: "testuser" };

    it("renders without crashing", async () => {
        render(
            <MemoryRouter>
            <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
              <EventList />
            </CurrentUserContext.Provider>
          </MemoryRouter>
      );
        expect(await screen.findByText(/Event 1/i)).toBeInTheDocument();
    });

    it("displays a message if no events are found", async () => {
        PetApi.getEvents.mockResolvedValueOnce([]);

        render(
            <MemoryRouter>
      <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
        <EventList />
      </CurrentUserContext.Provider>
    </MemoryRouter>
        );
        expect(await screen.findByText(/No events found/i)).toBeInTheDocument();
    });
});
