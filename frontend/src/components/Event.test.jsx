import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Event from "./Event";
import { CurrentUserContext } from "../CurrentUserContext";
import "@testing-library/jest-dom";

describe("Event Component", () => {
  const mockEvent = {
    id: 1,
    title: "Pet Adoption Fair",
    date: "2025-01-10",
    location: "Community Center",
    createdBy: 1  
  };
  const currentUser = { id: 1, username: "testuser" };

  it("renders event title, date, and location", () => {
    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser }}>
          <Event event={mockEvent} />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Pet Adoption Fair")).toBeInTheDocument();
    expect(screen.getByText("2025-01-10")).toBeInTheDocument();
    expect(screen.getByText("Community Center")).toBeInTheDocument();
  });

  it("does not show edit and delete options if currentUser is not the event owner", () => {
    const anotherUser = { id: 2, username: "anotheruser" };
    const onDeleteMock = vi.fn();
    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: anotherUser }}>
          <Event event={mockEvent} onDelete={onDeleteMock} />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("navigates to event details page on title click", () => {
    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser }}>
          <Event event={mockEvent} />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Pet Adoption Fair"));
    expect(screen.getByRole('link')).toHaveAttribute('href', '/events/1'); 
  });
});
