import axios from "axios";
// console.log("api.js loaded successfully");

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const BASE_URL = "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class PetApi {
    // the token for interactive with the API will be stored here.
    static token = localStorage.getItem("token") || null;

    static setToken(token) {
        this.token = token;
        localStorage.setItem("token", token);
    }

    static getToken() {
        return localStorage.getItem("token");
    }

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);


        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        // Log the token to ensure it is being set
        // console.log("Token being sent:", this.token);

        const url = `${BASE_URL}/${endpoint}`;

        const headers = { Authorization: `Bearer ${this.token}` };
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response || err);

            let message = err.response?.data?.error?.message || "Unknown error occured";
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    /** Login user and get token. */
    static async login(data) {
        let res = await this.request("auth/token", data, "post");
        // this.setToken(res.token);
        return res.token;
    }

    /** Register a new user. */
    static async signup(data) {
        let res = await this.request("auth/register", data, "post");
        // this.setToken(res.token);
        return res.token;
    }

    /** Get user profile. */
    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    /** Update user profile. */
    static async updateUser(username, data) {
        let res = await this.request(`users/${username}`, data, "patch");
        return res.user;
    }

    /** Delete an user by id. */
    static async deleteUser(username) {
        await this.request(`users/${username}`, {}, "delete");
    }

    /** Get GoogleAuthUrl. */
    static async getGoogleAuthUrl() {
        const res = await this.request("auth/google/url");
        return res.url;
    }

    /** Get all posts created by the logged-in user. */
    static async getUserPosts(username) {
        try {
            const res = await this.request(`users/${username}/posts`);
            return res.posts;
        } catch (err) {
            console.error("Error fetching user posts:", err);
            throw err;
        }
    }

    /** Get all pets created by the logged-in user. */
    static async getUserPets(username) {
        try {
            const res = await this.request(`users/${username}/pets`);
            return res.pets;
        } catch (err) {
            console.error("Error fetching user pets:", err);
            throw err;
        }
    }

    /** Create a new pet */
    static async createPet(petData) {
        try {
            const res = await this.request("pets", petData, "post");
            return res.pet;
        } catch (error) {
            console.error("Error in createPet:", error);
            throw error;
        }
    }

    /** Get a list of pets (with optional filters). */
    static async getPets(searchTerms = {}) {
        console.log("serachTarms before :",searchTerms);
        let res = await this.request("pets", searchTerms);
        return res.pets;
    }

    /** Get details on a pet by id. */
    static async getPet(id) {
        let res = await this.request(`pets/${id}`);
        return res.pet;
    }

    /** Get distinct pet types. */
    static async getDistinctTypes() {
        const res = await this.request("pets/types");
        return res.types;
    }

    /** Get distinct pet breeds. */
    static async getDistinctBreeds() {
        const res = await this.request("pets/breeds");
        return res.breeds;
    }

    /** Update an existing pet. */
    static async updatePet(id, petData) {
        const res = await this.request(`pets/${id}`, petData, "patch");
        // console.log(res.pet);
        return res.pet;
    }

    /** Delete a pet by ID. */
    static async deletePet(id) {
        await this.request(`pets/${id}`, {}, "delete");
    }

    /** Create a new post */
    static async createPost(postData) {
        try {
            const res = await this.request("posts", postData, "post");
            return res.post;
        } catch (error) {
            console.error("Error in createPost:", error);
            throw error;
        }
    }

    /** Get all posts (with optional filters). */
    static async getPosts(filters = {}) {
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value && value.toString().trim() !== "")
        );

        try {
            const res = await this.request("posts", cleanedFilters);
            return res.posts;
        } catch (err) {
            console.error("Error fetching posts:", err);
            throw err;
        }
    }

    /** Get a specific post by id. */
    static async getPost(id) {
        let res = await this.request(`posts/${id}`);
        return res.post;
    }

    /** Update an existing post. */
    static async updatePost(id, postData) {
        const res = await this.request(`posts/${id}`, postData, "patch");
        // console.log(res.post);
        return res.post;
    }

    /** Delete a post by ID. */
    static async deletePost(id) {
        await this.request(`posts/${id}`, {}, "delete");
    }

    /** Create a new event. */
    static async createEvent(eventData) {
        const res = await this.request("events", eventData, "post");
        return res.event;
    }

    /** Get a list of events (with optional filters). */
    static async getEvents(filters = {}) {
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => {
                return typeof value === 'string' ? value.trim() !== "" : value != null;
            })
        );
        console.log("Clened Filters:", cleanedFilters);
        try {
            const res = await this.request("events", cleanedFilters);
            return res.events;
        } catch (err) {
            console.error("Error fetching events:", err);
            throw err;
        }
    }

    /** Get details on an event by id. */
    static async getEvent(id) {
        const res = await this.request(`events/${id}`);
        return res.event;
    }

    /** Update an existing event. */
    static async updateEvent(id, eventData) {
        const res = await this.request(`events/${id}`, eventData, "patch");
        return res.event;
    }

    /** Delete an event by id. */
    static async deleteEvent(id) {
        await this.request(`events/${id}`, {}, "delete");
    }


    /** Check is post liked by user.  */
    static async isPostLiked(postId) {
        try {
            const res = await this.request(`likes/${postId}`, {}, "get");
            return res.isLiked;
        } catch (err) {
            console.error("Error checking like status:", err);
            throw err;
        }
    }

    /** Get likes count. */
    static async getLikesCount(postId) {
        try {
            const res = await this.request(`likes/count/${postId}`, {}, "get");
            return res.likesCount;
        } catch (err) {
            console.error("Error fetching likes count:", err);
            throw err;
        }
    }


    /** Add like to post. */
    static async addLike(postId, data) {
        console.log("Adding like for post ID:", postId); // Debug log
        try {
            const res = await this.request("likes", { postId, ...data }, "post");
            console.log("Add Like Response:", res);
            return res;
        } catch (err) {
            console.error("Error adding like:", err.response || err);
            throw err;
        }
    }

    /** Remove like from post. */
    static async removeLike(postId) {
        try {
            return await this.request(`likes/${postId}`, {}, "delete");
        } catch (err) {
            console.error("Error removing like:", err);
            throw err;
        }
    }


    /** Get comments for post. */
    static async getComments(postId) {
        const res = await this.request(`comments/${postId}`, {}, "get");
        return res.comments;
    }

    /** Add comment to post. */
    static async addComment(postId, commentData) {
        const res = await this.request(`comments/${postId}`, commentData, "post");
        return res.comment;
    }


    /** Update an existing comment. */
    static async updateComment(postId, commentData) {
        const res = await this.request(`comments/${postId}`, commentData, "patch");
        console.log(res.comment);
        return res.comment;
    }

    /** Remove comment from post. */
    static async removeComment(postId) {
        console.log("Removing comment for post ID:", postId); // Debug log
        try {
            return await this.request(`comments/${postId}`, {}, "delete");
        } catch (err) {
            console.error("Error removing comment:", err);
            throw err;
        }
    }

    /** Get Notifications for user. */
    static async getNotifications(userId) {
        try {
            return await this.request(`notifications/${userId}`);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    }

    /** Mark Notifications as read. */
    static async markNotificationAsRead(notificationId) {
        try {
            return await this.request(`notifications/read/${notificationId}`, {}, 'post');
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    }


}



export default PetApi;