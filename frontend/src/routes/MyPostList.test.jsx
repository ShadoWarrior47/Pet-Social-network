// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import MyPostList from "./MyPostList";
// import { vi } from "vitest";
// import { CurrentUserContext } from "../CurrentUserContext";
// import { MemoryRouter } from "react-router-dom";
// import PetApi from "../PetApi";
// import '@testing-library/jest-dom';

// // Mock PetApi
// vi.mock("../PetApi", () => ({
//   __esModule: true, // ensures ES module compatibility
//   default: {
//     getUserPosts: vi.fn().mockResolvedValue([
//       { id: 1, title: "Post 1", content: "Content 1" },
//       { id: 2, title: "Post 2", content: "Content 2" },
//     ]),
//     deletePost: vi.fn(),
//   },
// }));

// describe("MyPostList Component", () => {
//   const mockCurrentUser = { id: 1, username: "testuser" };

//   it("renders without crashing", async () => {
//     render(
//       <MemoryRouter>
//         <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
//           <MyPostList />
//         </CurrentUserContext.Provider>
//       </MemoryRouter>
//     );
//     expect(await screen.findByText(/Post 1/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Content 1/i)).toBeInTheDocument();
//   });

//   it("displays a message if no posts are found", async () => {
//     PetApi.getUserPosts.mockResolvedValueOnce([]);

//     render(
//       <MemoryRouter>
//         <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
//           <MyPostList />
//         </CurrentUserContext.Provider>
//       </MemoryRouter>
//     );
//     expect(await screen.findByText(/No posts found/i)).toBeInTheDocument();
//   });

//   it("handles post deletion correctly", async () => {
//     PetApi.deletePost.mockResolvedValue({});
//     PetApi.getUserPosts.mockResolvedValueOnce([
//       { id: 1, title: "Post 1", content: "Content 1" }
//     ]).mockResolvedValueOnce([]);

//     render(
//       <MemoryRouter>
//         <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
//           <MyPostList />
//         </CurrentUserContext.Provider>
//       </MemoryRouter>
//     );

//     expect(await screen.findByText(/Post 1/i)).toBeInTheDocument();
//     fireEvent.click(screen.getByText(/Delete/i));
//     expect(PetApi.deletePost).toHaveBeenCalledWith(1);

//     await screen.findByText(/No posts found/i); // Verifying UI updates after deletion
//   });

//   it("handles pagination correctly", async () => {
//     // Assuming pagination needs specific testing, similar mocks would be set up
//     render(
//       <MemoryRouter>
//         <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
//           <MyPostList />
//         </CurrentUserContext.Provider>
//       </MemoryRouter>
//     );

//     // Assuming "Next" and "Previous" buttons are part of the component
//     fireEvent.click(screen.getByText(/Next/i));
//     expect(screen.getByText(/Post 2/i)).toBeInTheDocument(); // Expecting the second page of posts to be rendered
//   });
// });

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import MyPostList from "./MyPostList";
import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import '@testing-library/jest-dom';

// Correctly mock PetApi with both default and named exports if necessary
vi.mock("../PetApi", () => ({
  __esModule: true,
  default: {
    getUserPosts: vi.fn(),
    deletePost: vi.fn(),
  },
}));

describe("MyPostList Component", () => {
  const mockCurrentUser = { id: 1, username: "testuser" };

  beforeEach(() => {
    PetApi.getUserPosts.mockClear();
    PetApi.deletePost.mockClear();
  });

  it("renders without crashing", async () => {
    PetApi.getUserPosts.mockResolvedValue([
      { id: 1, title: "Post 1", content: "Content 1" },
      { id: 2, title: "Post 2", content: "Content 2" },
    ]);

    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <MyPostList />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Content 1/)).toBeInTheDocument();
      expect(screen.getByText(/Content 2/)).toBeInTheDocument();
    });
  });

  it("displays a message if no posts are found", async () => {
    PetApi.getUserPosts.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockCurrentUser }}>
          <MyPostList />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No posts found/)).toBeInTheDocument();
    });
  });
});
