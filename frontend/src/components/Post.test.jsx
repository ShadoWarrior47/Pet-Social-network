import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Post from "./Post";
import '@testing-library/jest-dom';

it("renders without crashing", function () {
    render(
        <MemoryRouter>
            <Post post={{ id: 5, content: "Test Post"}} />
        </MemoryRouter>
    );
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <Post post={{ id: 5, content: "Test Post" }} />
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

it("displays pet details correctly", function () {
    const { getByText } = render(
        <MemoryRouter>
            <Post post={{ id: 5, content: "Test Post"}} />
        </MemoryRouter>
    );

    expect(getByText("Test Post")).toBeInTheDocument();
    // expect(getByText("This is a test company.")).toBeInTheDocument();
});
