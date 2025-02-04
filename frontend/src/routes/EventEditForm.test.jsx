
// EventEditForm.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CurrentUserContext } from "../CurrentUserContext";
import { vi } from "vitest";

import PetApi from "../PetApi"; // Already mocked below
import EventEditForm from "./EventEditForm";

// Our navigate mock
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "7" }),
    useNavigate: () => mockNavigate,
  };
});

// Mock all PetApi calls
vi.mock("../PetApi", () => {
  return {
    __esModule: true,
    default: {
      getEvent: vi.fn(),
      updateEvent: vi.fn(),
    },
  };
});

describe("EventEditForm Component", () => {
  const currentUser = { username: "testuser" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("submitting form sends API call and shows success message", async () => {
    PetApi.getEvent.mockResolvedValue({
      title: "PlayDay",
      description: "All Dogs Welcome",
      location: "Germantown",
      date: "2025-01-21T00:00:00.000Z",
      startTime: "08:00",
      endTime: "12:00",
    });
    PetApi.updateEvent.mockResolvedValue({}); // success

    render(
      <MemoryRouter initialEntries={["/events/7"]}>
        <CurrentUserContext.Provider value={{ currentUser }}>
          <Routes>
            <Route path="/events/:id" element={<EventEditForm />} />
          </Routes>
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    // Wait for event to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("PlayDay")).toBeInTheDocument();
    });

    // Change title
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New PlayDay" },
    });

    // Submit
    fireEvent.click(screen.getByText("Update Event"));

    // Wait for success
    await waitFor(() => {
      // Check success message
      expect(
        screen.getByText("Event updated successfully!!")
      ).toBeInTheDocument();

      // Check API call
      expect(PetApi.updateEvent).toHaveBeenCalledWith("7", {
        title: "New PlayDay",
        description: "All Dogs Welcome",
        location: "Germantown",
        date: "2025-01-21",
        startTime: "08:00",
        endTime: "12:00",
      });
    });

    // Check navigation if we removed the NODE_ENV check
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/events/7");
    });
  });

  
});
