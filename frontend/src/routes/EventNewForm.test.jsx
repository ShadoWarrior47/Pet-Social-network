
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import EventNewForm from "./EventNewForm";
import PetApi from "../PetApi"; // if you have a default import
import '@testing-library/jest-dom';

// Mock PetApi
vi.mock("../PetApi", () => ({
  default: {
    createEvent: vi.fn(),
  },
}));

// Mock useLoadScript to always return isLoaded as true
vi.mock('@react-google-maps/api', () => ({
  useLoadScript: () => ({ isLoaded: true, loadError: null }),
  Autocomplete: ({ children }) => <>{children}</>  
}));

describe("EventNewForm", () => {
  const currentUser = { id: 1, username: "testuser" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls createEvent on form submission with correct data", async () => {
    // Mock success
    PetApi.createEvent.mockResolvedValueOnce({
      id: 123,
      title: "Community Meetup",
      description: "An event for everyone.",
      location: "City Park",
      date: "2025-02-20",
      startTime: "10:00",
      endTime: "14:00",
      createdBy: currentUser.id,
    });

    render(
      <MemoryRouter>
        <EventNewForm currentUser={currentUser} />
      </MemoryRouter>
    );

    // Fill ALL required fields
    fireEvent.change(screen.getByLabelText("Title :"), {
      target: { value: "Community Meetup" },
    });
    fireEvent.change(screen.getByLabelText("Description :"), {
      target: { value: "An event for everyone." },
    });
    fireEvent.change(screen.getByLabelText("Location :"), {
      target: { value: "City Park" },
    });
    fireEvent.change(screen.getByLabelText("Date :"), {
      target: { value: "2025-02-20" },
    });
    fireEvent.change(screen.getByLabelText("Start Time :"), {
      target: { value: "10:00" },
    });
    fireEvent.change(screen.getByLabelText("End Time :"), {
      target: { value: "14:00" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Event"));

    // Wait for createEvent to be called
    await waitFor(() => {
      expect(PetApi.createEvent).toHaveBeenCalledWith(expect.objectContaining({
        title: "Community Meetup",
        description: "An event for everyone.",
        location: "City Park",
        date: "2025-02-20",
        startTime: "10:00",
        endTime: "14:00",
        createdBy: 1,
      }));
    });
  });

  it("displays an error message if event creation fails", async () => {
    // Mock failure
    PetApi.createEvent.mockRejectedValueOnce(new Error("Failed to create event"));

    render(
      <MemoryRouter>
        <EventNewForm currentUser={currentUser} />
      </MemoryRouter>
    );

    // Fill all required fields again
    fireEvent.change(screen.getByLabelText("Title :"), {
      target: { value: "Community Meetup" },
    });
    fireEvent.change(screen.getByLabelText("Description :"), {
      target: { value: "An event for everyone." },
    });
    fireEvent.change(screen.getByLabelText("Location :"), {
      target: { value: "City Park" },
    });
    fireEvent.change(screen.getByLabelText("Date :"), {
      target: { value: "2025-02-20" },
    });
    fireEvent.change(screen.getByLabelText("Start Time :"), {
      target: { value: "10:00" },
    });
    fireEvent.change(screen.getByLabelText("End Time :"), {
      target: { value: "14:00" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Event"));

    // Confirm the error is rendered
    await waitFor(() => {
      expect(PetApi.createEvent).toHaveBeenCalledTimes(1);
      // The error message is set in state and rendered in the DOM
      expect(screen.getByText("Failed to create event. Please try again."))
        .toBeInTheDocument();
    });
  });
});
