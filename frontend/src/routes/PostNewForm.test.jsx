
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostNewForm from "./PostNewForm";
import { vi } from "vitest";
import PetApi from "../PetApi";

// Mocking the PetApi module
vi.mock("../PetApi", () => ({
    default: {
      createPost: vi.fn(() => Promise.resolve({ id: 1 }))
    }
  }));
  
// Mocking the useNavigate hook
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => vi.fn().mockImplementation(() => (path) => console.log(`Navigate to ${path}`)),
    };
  });

it("renders without crashing", function () {
    render(
        <MemoryRouter>
            <PostNewForm currentUser={{ id: 1 }} />
        </MemoryRouter>
    );
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <PostNewForm currentUser={{ id: 1 }} />
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

it("submits the form with post data", async function () {
    const { getByLabelText, getByText } = render(
        <MemoryRouter>
            <PostNewForm currentUser={{ id: 1 }} />
        </MemoryRouter>
    );

    const contentInput = getByLabelText("Content :");
    const imageUrlInput = getByLabelText("Image URL :");
    const submitButton = getByText("Add Post");

    // Simulate user typing into the input fields
    fireEvent.change(contentInput, { target: { value: "New Post Content" } });
    fireEvent.change(imageUrlInput, { target: { value: "http://example.com/image.jpg" } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for expectations to avoid act warnings
    await waitFor(() => {
      expect(PetApi.createPost).toHaveBeenCalledWith({
        content: "New Post Content",
        imageUrl: "http://example.com/image.jpg",
        ownerId: 1
      });
    });
});



// import React from "react";
// import { render, fireEvent } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import PostNewForm from "./PostNewForm";
// import { vi } from "vitest";

// const mockCreatePost = vi.fn();

// // Mock react-router-dom
// const mockNavigate = vi.fn();
// vi.mock("react-router-dom", () => ({
//     ...vi.importActual("react-router-dom"),
//     useNavigate: () => mockNavigate,
// }));

// // Mock PetApi module
// vi.mock("../PetApi", () => ({
//     createPost: mockCreatePost,
// }));


// const currentUser = { id: 1 };

// describe("PostNewForm Tests", () => {
//     it("renders without crashing", function () {
//         render(
//             <MemoryRouter>
//                 <PostNewForm currentUser={currentUser} />
//             </MemoryRouter>
//         );
//     });

//     it("matches snapshot", function () {
//         const { asFragment } = render(
//             <MemoryRouter>
//                 <PostNewForm currentUser={currentUser} />
//             </MemoryRouter>
//         );
//         expect(asFragment()).toMatchSnapshot();
//     });

//     it("updates input fields correctly", function () {
//         const { getByLabelText } = render(
//             <MemoryRouter>
//                 <PostNewForm currentUser={currentUser} />
//             </MemoryRouter>
//         );

//         const contentInput = getByLabelText("Content :");
//         const imageUrlInput = getByLabelText("Image URL :");

//         fireEvent.change(contentInput, { target: { value: "New post content" } });
//         fireEvent.change(imageUrlInput, { target: { value: "http://example.com/image.jpg" } });

//         expect(contentInput.value).toBe("New post content");
//         expect(imageUrlInput.value).toBe("http://example.com/image.jpg");
//     });

//     it("submits form with correct data", async function () {
//         // mockCreatePost.mockResolvedValue({ id: 123 });

//         const { getByLabelText, getByText } = render(
//             <MemoryRouter>
//                 <PostNewForm currentUser={currentUser} />
//             </MemoryRouter>
//         );

//         fireEvent.change(getByLabelText("Content :"), { target: { value: "Test post" } });
//         fireEvent.change(getByLabelText("Image URL :"), { target: { value: "http://example.com/image.jpg" } });

//         fireEvent.click(getByText("Add Post"));

//         // Obtain the mock from PetApi
//         const { createPost } = require("../PetApi");
//         expect(createPost).toHaveBeenCalledWith({
//             content: "Test post",
//             imageUrl: "http://example.com/image.jpg",
//             ownerId: 1,
//         });

//         // expect(mockCreatePost).toHaveBeenCalledWith({
//         //     content: "Test post",
//         //     imageUrl: "http://example.com/image.jpg",
//         //     ownerId: 1,
//         // });

//         await expect(mockNavigate).toHaveBeenCalledWith("/posts/123");
//     });

//     it("shows alert on post creation failure", async function () {
//         // Update the mock to simulate a failure
//         const { createPost } = require("../PetApi");
//         createPost.mockRejectedValue(new Error("Failed to create post"));
//         window.alert = vi.fn();

//         const { getByText } = render(
//             <MemoryRouter>
//                 <PostNewForm currentUser={currentUser} />
//             </MemoryRouter>
//         );

//         fireEvent.click(getByText("Add Post"));

//         await expect(window.alert).toHaveBeenCalledWith("Failed to create post. Please try again.");
//     });
// });
