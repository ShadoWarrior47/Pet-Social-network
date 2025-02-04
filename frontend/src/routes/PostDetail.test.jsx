import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PetApi from "../PetApi";
import PostDetail from "./PostDetail";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock PetApi to control its behavior during tests
vi.mock("../PetApi");

describe("PostDetail component", () => {
  const mockPost = {
    id: 1,
    content: "Test Post Content",
    imageUrl: "https://via.placeholder.com/150",
    ownerId: 123,
    createdAt: "2025-01-01T12:00:00Z",
  };

  beforeEach(() => {
    // Default mock return values for each test
    PetApi.getPost.mockResolvedValue(mockPost);
    PetApi.getComments.mockResolvedValue([]);  // Default to an empty array for comments
  });

  it("renders loading state initially", () => {
    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders post details after fetching successfully", async () => {
    // PetApi.getPost.mockResolvedValueOnce(mockPost);

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockPost.content)).toBeInTheDocument();
      expect(screen.getByText(`Posted by User ID: ${mockPost.ownerId}`)).toBeInTheDocument();
      expect(screen.getByText(/created at:/i)).toBeInTheDocument();
      expect(screen.getByRole("img", { name: /post/i })).toHaveAttribute("src", mockPost.imageUrl);
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    PetApi.getPost.mockRejectedValueOnce(new Error("Failed to fetch post"));

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    // Asserting that console.error was called with the expected error
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching post details:",
      expect.any(Error)
    );

    // Restore the original console.error after the test
    consoleErrorSpy.mockRestore();
  });
});
