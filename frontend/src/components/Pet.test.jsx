import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Pet from "./Pet";
import '@testing-library/jest-dom';

it("renders without crashing", function () {
    render(
        <MemoryRouter>
            <Pet pet={{ id: 5, name: "Test Pet", type: "Dog" }} />
        </MemoryRouter>
    );
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <Pet pet={{ id: 5, name: "Test Pet", type: "Dog" }} />
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

it("displays pet details correctly", function () {
    const { getByText } = render(
        <MemoryRouter>
            <Pet pet={{ id: 5, name: "Test Pet", type: "Dog" }} />
        </MemoryRouter>
    );

    expect(getByText("Test Pet")).toBeInTheDocument();
    // expect(getByText("This is a test company.")).toBeInTheDocument();
});
