// PostEditForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostEditForm from './PostEditForm';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CurrentUserContext } from '../CurrentUserContext';
import PetApi from '../PetApi';    // IMPORTANT: Use default import here too
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the PetApi module as a default export with { getPost, updatePost } methods:
vi.mock('../PetApi', () => ({
  default: {
    getPost: vi.fn(),
    updatePost: vi.fn(),
  },
}));

describe('PostEditForm Component', () => {
  const currentUser = { username: 'testuser' };
  const postId = '123';
  const postData = {
    content: 'Test content',
    imageUrl: 'http://example.com/image.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // By default, resolve getPost with valid data and updatePost with an empty object
    PetApi.getPost.mockResolvedValue(postData);
    PetApi.updatePost.mockResolvedValue({});
  });

  test('renders the form with post data', async () => {
    render(
      <MemoryRouter initialEntries={[`/posts/${postId}`]}>
        <Routes>
          <Route
            path="/posts/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser }}>
                <PostEditForm />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the post data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Content/i)).toHaveValue(postData.content);
      expect(screen.getByLabelText(/Image Url/i)).toHaveValue(postData.imageUrl);
    });
  });

  test('updates the form values and submits successfully', async () => {
    render(
      <MemoryRouter initialEntries={[`/posts/${postId}`]}>
        <Routes>
          <Route
            path="/posts/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser }}>
                <PostEditForm />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the form to load
    await waitFor(() => screen.getByLabelText(/Content/i));

    // Change the content field
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Updated content' },
    });

    // Submit
    fireEvent.click(screen.getByText('Update Post'));

    // Verify the update call
    await waitFor(() => {
      expect(PetApi.updatePost).toHaveBeenCalledWith(postId, {
        content: 'Updated content',
        imageUrl: postData.imageUrl,
      });
      expect(screen.getByText('Post updated successfully!!')).toBeInTheDocument();
    });
  });

  test('shows error message if post fetch fails', async () => {
    PetApi.getPost.mockRejectedValue(new Error('Failed to fetch post'));

    render(
      <MemoryRouter initialEntries={[`/posts/${postId}`]}>
        <Routes>
          <Route
            path="/posts/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser }}>
                <PostEditForm />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Could not load post details.')).toBeInTheDocument();
    });
  });

  test('shows error message if form submission fails', async () => {
    PetApi.updatePost.mockRejectedValue(new Error('Failed to update post'));

    render(
      <MemoryRouter initialEntries={[`/posts/${postId}`]}>
        <Routes>
          <Route
            path="/posts/:id"
            element={
              <CurrentUserContext.Provider value={{ currentUser }}>
                <PostEditForm />
              </CurrentUserContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for initial data
    await waitFor(() => screen.getByLabelText(/Content/i));

    fireEvent.click(screen.getByText('Update Post'));

    await waitFor(() => {
      expect(screen.getByText('Failed to update post')).toBeInTheDocument();
    });
  });
});

