import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignupForm from "./SignupForm";
import { vi } from "vitest";

it("renders without crashing", function () {
    render(
        <MemoryRouter>
            <SignupForm signup={() => { }} />
        </MemoryRouter>
    );
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <SignupForm signup={() => { }} />
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

it("runs the signup function on form submit", async function () {
    const signupMock = vi.fn();
    const { getByLabelText, getByText } = render(
        <MemoryRouter>
            <SignupForm signup={signupMock} />
        </MemoryRouter>
    );

    const usernameInput = getByLabelText("Username :");
    const passwordInput = getByLabelText("Password :");
    const nameInput = getByLabelText("Name :");
    const emailInput = getByLabelText("E-mail :");
    const profilePicInput = getByLabelText("Profile Picture Url :");
    const submitButton = getByText("Sign up");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(nameInput, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
    fireEvent.change(profilePicInput, { target: { value: "http://example.com/profile.jpg" } });


    fireEvent.click(submitButton);

    expect(signupMock).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
        name: "Test",
        email: "testuser@example.com",
        profilePic: "http://example.com/profile.jpg",
        isAdmin: false,
    });
});
