import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PetApi from "../PetApi";

function PostDetail({ currentUser }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const fetchedPost = await PetApi.getPost(id);
        setPost(fetchedPost);
        if (fetchedPost) {
          const fetchedComments = await PetApi.getComments(id);
          setComments(fetchedComments);
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
        setComments([]);
      }
    }
    fetchPost();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const newCommentObj = await PetApi.addComment(post.id, { content: newComment });
      setComments(prev => [...prev, newCommentObj]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await PetApi.removeComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Handle editing a comment
  const handleEditComment = async (e) => {
    e.preventDefault();
    try {
      const updatedComment = await PetApi.updateComment(editingCommentId, { content: editingContent });
      setComments((prev) =>
        prev.map((comment) => (comment.id === editingCommentId ? updatedComment : comment))
      );
      setEditingCommentId(null);
      setEditingContent("");
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.content}</h1>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
      <p>Posted by User ID: {post.ownerId}</p>
      <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>

      <h2>Comments:</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="Post-comment">
          {editingCommentId === comment.id ? (
            <form onSubmit={handleEditComment}>
              <input
                type="text"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
              />
              <button type="submit">Save</button>
              <button onClick={() => setEditingCommentId(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <strong>{comment.username}</strong>: {comment.content}
              {currentUser && currentUser.username === comment.username && (
                <>
                  <button onClick={() => { setEditingCommentId(comment.id); setEditingContent(comment.content); }}>Edit</button>
                  <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                </>
              )}
            </>
          )}
        </div>
      ))}
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
}

export default PostDetail;
