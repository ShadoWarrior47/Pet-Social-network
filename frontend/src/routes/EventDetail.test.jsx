

import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import EventDetail from "./EventDetail";
import PetApi from "../PetApi";
import '@testing-library/jest-dom';

vi.mock("../PetApi", () => ({
  __esModule: true,
  default: {
    getEvent: vi.fn().mockResolvedValue({
      id: 1,
      title: "Pet Meetup",
      location: "Park Avenue",
      date: "2025-01-15",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      description: "A fun event to meet pets.",
      createdBy: "test-user",
    }),
  },
}));

describe("EventDetail Component", () => {
  it("renders without crashing", async () => {
    render(
      <MemoryRouter initialEntries={["/events/1"]}>
        <Routes>
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for your mocked data to load
    expect(await screen.findByText(/Pet Meetup/i)).toBeInTheDocument();
  });

  it("displays event details", async () => {
    render(
      <MemoryRouter initialEntries={["/events/1"]}>
        <Routes>
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for your mocked data to load
    expect(await screen.findByText(/Park Avenue/i)).toBeInTheDocument();
    expect(await screen.findByText(/2025-01-15/i)).toBeInTheDocument();
  });
});
