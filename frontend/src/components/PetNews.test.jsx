import React from "react";
import { render, screen } from "@testing-library/react";
import PetNews from "./PetNews";
import '@testing-library/jest-dom';

describe("PetNews Component", () => {
  // Test for basic rendering
  it("renders without crashing", () => {
    render(<PetNews text="Check out the latest pet news!" />);
    expect(screen.getByText("Check out the latest pet news!")).toBeInTheDocument();
  });

  // Test to verify the text content is displayed
  it("displays the text content provided", () => {
    const testText = "Latest update on pet care!";
    render(<PetNews text={testText} />);
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  // Test to check if the image is rendered conditionally
  it("conditionally renders an image if imageUrl is provided", () => {
    const testImageUrl = "http://example.com/pet.jpg";
    render(<PetNews text="Learn more about pets" imageUrl={testImageUrl} />);
    const image = screen.getByRole('img', { name: /pet news/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', testImageUrl);
  });

  // Test to verify that the image is not rendered if imageUrl is not provided
  it("does not render an image if imageUrl is not provided", () => {
    render(<PetNews text="Learn more about pets" />);
    const image = screen.queryByRole('img', { name: /pet news/i });
    expect(image).not.toBeInTheDocument();
  });

  // Test to check if the link is rendered conditionally
  it("conditionally renders a link if url is provided", () => {
    const testUrl = "http://example.com/more-info";
    render(<PetNews text="Learn more about pets" url={testUrl} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', testUrl);
    expect(link.textContent).toMatch(/read more/i);
  });

  // Test to verify that the link is not rendered if url is not provided
  it("does not render a link if url is not provided", () => {
    render(<PetNews text="Learn more about pets" />);
    const link = screen.queryByRole('link');
    expect(link).not.toBeInTheDocument();
  });
});
