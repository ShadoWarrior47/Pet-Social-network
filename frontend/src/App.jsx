import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PetApi from "./PetApi";
import { jwtDecode } from 'jwt-decode';
import useLocalStorage from "./hooks/useLocalStorage";
import ProtectedRoute from "./ProtectedRoute";
import { CurrentUserProvider } from "./CurrentUserContext";

import Home from "./routes/Home";
import NavBar from "./components/NavBar";
import LoginForm from "./routes/LoginForm";
import SignupForm from "./routes/SignupForm";

import PetList from "./routes/PetList";
import PetNewForm from "./routes/PetNewForm";
import PetEditForm from "./routes/PetEditForm";
import PetDetail from "./routes/PetDetail";

import PostList from "./routes/PostList";
import PostNewForm from "./routes/PostNewForm";
import PostEditForm from "./routes/PostEditForm";
import PostDetail from "./routes/PostDetail";

import EventList from "./routes/EventList";
import EventNewForm from "./routes/EventNewForm";
import EventEditForm from "./routes/EventEditForm";
import EventDetail from "./routes/EventDetail";

import Profile from "./routes/Profile";
import ProfileEditForm from "./routes/ProfileEditForm";

import Notifications from './components/Notification';

import PetNewsList from "./routes/PetNewsList";

import "./App.css";


function App() {
  const [token, setToken] = useLocalStorage("pet-token", null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          PetApi.token = token;
          const { username } = jwtDecode(token);

          const user = await PetApi.getCurrentUser(username);
          setCurrentUser(user);
        } catch (err) {
          console.error("Error Fetching User", err);
          setToken(null);
          setCurrentUser(null);
        }
      }
      else {
        setCurrentUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, [token, setToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Login function
  const login = async (loginData) => {
    try {
      const newToken = await PetApi.login(loginData);
      console.log(loginData);
      setToken(newToken);
      PetApi.token = newToken;

      const { username } = jwtDecode(newToken);
      const user = await PetApi.getCurrentUser(username);

      setCurrentUser(user);
      return true;
    } catch (err) {
      console.log(err.response);
      console.error("Login failed:", err);
      return false;
    }
  };

  // Signup function
  const signup = async (signupData) => {
    try {
      const newToken = await PetApi.signup(signupData);
      setToken(newToken);
      PetApi.token = newToken;

      const { username } = jwtDecode(newToken);
      const user = await PetApi.getCurrentUser(username);

      setCurrentUser(user);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  async function createPet(petData) {
    try {
      const newPet = await PetApi.createPet(petData); // Calls your API
      console.log("Pet created successfully:", newPet);
      return newPet;
    } catch (err) {
      console.error("Error creating pet:", err);
      throw err; // Ensure the error is propagated
    }
  }

  const isAuthenticated = !!token && !!currentUser;

  return (
    <CurrentUserProvider currentUser={currentUser}>
      <BrowserRouter>
        <NavBar onLogout={() => {
          setToken(null);
          PetApi.token = null;
          setCurrentUser(null);
        }} />

        <Routes>
          <Route path="/" element={<Home loading={loading} />} />
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/signup" element={<SignupForm signup={signup} />} />

          <Route path="/pets" element={<PetList />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/posts/:id" element={<PostDetail currentUser={currentUser} />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute
                element={<Profile />}
                isAuthenticated={isAuthenticated}
                loading={loading}
              />} />

          <Route
            path="/users/edit/:username"
            element={
              <ProtectedRoute
                element={<ProfileEditForm currentUser={currentUser} />}
                isAuthenticated={isAuthenticated}
                loading={loading}
              />} />

          <Route
            path="/pets"
            element={
              <ProtectedRoute
                element={<PetList />}
                isAuthenticated={isAuthenticated}
              />} />

          <Route
            path="/pets/new"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<PetNewForm createPet={createPet} currentUser={currentUser} />}
              />} />

          <Route
            path="/pets/:id"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<PetDetail />}

              />} />

          <Route
            path="/pets/edit/:id"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<PetEditForm currentUser={currentUser} />}
              />} />

          <Route
            path="/posts"
            element={
              <ProtectedRoute
                element={<PostList />}
                isAuthenticated={isAuthenticated}
                loading={loading}
              />} />

          <Route
            path="/posts/new"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<PostNewForm currentUser={currentUser} />}
              />} />

          <Route
            path="/posts/edit/:id"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<PostEditForm currentUser={currentUser} />}
              />} />

          <Route
            path="/events/new"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<EventNewForm currentUser={currentUser} />}
              />} />

          <Route
            path="/events/edit/:id"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<EventEditForm currentUser={currentUser} />}
              />} />

          <Route
            path="/pet-news"
            element={
              <ProtectedRoute
                element={<PetNewsList />}
                isAuthenticated={isAuthenticated}
              />
            }
          />

          <Route path="*" element={<div>404 - Page Not Found</div>} />

        </Routes>
      </BrowserRouter>
    </CurrentUserProvider>
  );
}

export default App;