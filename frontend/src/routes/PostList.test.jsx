
import React from "react";
import { render, screen } from "@testing-library/react";
import PostList from "./PostList";
import PetApi from "../PetApi";
import { vi } from "vitest";
import { CurrentUserContext } from "../CurrentUserContext";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';

// Mock the PetApi
vi.mock("../PetApi");

const mockPosts = [
  { id: 10, content: "Post One", comments: [] },
  { id: 11, content: "Post Two", comments: [] },
];

describe("PostList Component", () => {
  beforeEach(() => {
    // By default, return the two mock posts
    PetApi.getPosts.mockResolvedValue(mockPosts);
  });

  it("renders without crashing and shows posts", async () => {
    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: { id: 1, name: "Test User" } }}>
          <PostList />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    // The component will call PetApi.getPosts and render "Post One" / "Post Two"
    expect(await screen.findByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
  });

  it("displays 'No posts found' when there are no posts", async () => {
    // Mock an empty array return
    PetApi.getPosts.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: { id: 1, name: "Test User" } }}>
          <PostList />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    // Wait for the "No posts found" text
    expect(await screen.findByText("No posts found")).toBeInTheDocument();
  });
});
