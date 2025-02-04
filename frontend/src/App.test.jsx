// App.test.jsx - Integration Test
import React from "react";
import { vi } from 'vitest';
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import PetApi from "./PetApi";
import '@testing-library/jest-dom';

// --- Mock jwt-decode ---
vi.mock('jwt-decode', () => ({
    jwtDecode: vi.fn(() => ({ username: "testuser" })),
}));

// --- Mock navigator.geolocation ---
beforeAll(() => {
    if (!("geolocation" in navigator)) {
        Object.defineProperty(navigator, "geolocation", {
            writable: true,
            value: {
                getCurrentPosition: vi.fn().mockImplementation((success, error, options) => {
                    const position = { coords: { latitude: 0, longitude: 0 } };
                    success(position);
                }),
            },
        });
    } else {
        navigator.geolocation.getCurrentPosition = vi.fn().mockImplementation((success, error, options) => {
            const position = { coords: { latitude: 0, longitude: 0 } };
            success(position);
        });
    }
});


describe("App integration tests", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });


    it('renders the home page at route "/"', async () => {
        window.history.pushState({}, "Home Page", "/");

        render(<App />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });

        expect(screen.getByText(/Vibrant social networking platform where you can celebrate your passion for animals./i)).toBeInTheDocument();
    });


    it('redirects unauthenticated users to the login page for a protected route', async () => {
        window.history.pushState({}, "Protected Page", "/profile");

        render(<App />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });

        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });


    it("renders the profile page when authenticated", async () => {
        // Set a fake token in localStorage.
        const fakeToken = "fake.jwt.token";
        localStorage.setItem("pet-token", JSON.stringify(fakeToken));

        // Mock PetApi.getCurrentUser to return a fake user.
        const fakeUser = { username: "testuser", name: "Test User" };
        vi.spyOn(PetApi, "getCurrentUser").mockResolvedValue(fakeUser);

        window.history.pushState({}, "Profile Page", "/profile");

        render(<App />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });

        expect(
            screen.getByRole("heading", { name: /testuser Profile/i })
        ).toBeInTheDocument();
    });
});
