

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import '@testing-library/jest-dom';

vi.mock("../PetApi", () => ({
  __esModule: true,
  default: {
    updateUser: vi.fn(),
  },
}));

import PetApi from "../PetApi";
import { CurrentUserContext } from "../CurrentUserContext";
import ProfileEditForm from "./ProfileEditForm";

const mockUser = {
  username: "testuser",
  name: "Test User",
  profilePic: "http://example.com/profile.jpg",
  email: "testuser@example.com",
};

describe("ProfileEditForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the loading message when no currentUser", () => {
    const { getByText } = render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: null }}>
          <ProfileEditForm />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("populates form fields with user data", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <CurrentUserContext.Provider value={{ currentUser: mockUser }}>
          <ProfileEditForm />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );
    expect(getByLabelText("Username").value).toBe("testuser");
    expect(getByLabelText("Name").value).toBe("Test User");
    expect(getByLabelText("Profile Picture Url").value).toBe("http://example.com/profile.jpg");
    expect(getByLabelText("Email").value).toBe("testuser@example.com");
  });

  it("submits form and calls updateUser API", async () => {
    PetApi.updateUser.mockResolvedValue({
      ...mockUser,
      name: "Updated User",
    });
    const updateCurrentUserMock = vi.fn();

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <CurrentUserContext.Provider
          value={{ currentUser: mockUser, updateCurrentUser: updateCurrentUserMock }}
        >
          <ProfileEditForm />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText("Name"), { target: { value: "Updated User" } });
    fireEvent.click(getByText("Save Changes"));

    await waitFor(() => {
      expect(PetApi.updateUser).toHaveBeenCalledWith("testuser", {
        name: "Updated User",
        profilePic: "http://example.com/profile.jpg",
        email: "testuser@example.com",
        password: "",
      });
      expect(updateCurrentUserMock).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Updated User" })
      );
      expect(getByText("Profile updated successfully!!")).toBeInTheDocument();
    });
  });
});
