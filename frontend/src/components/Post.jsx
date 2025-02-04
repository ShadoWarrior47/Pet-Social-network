
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PetApi from "../PetApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment as fasComment } from '@fortawesome/free-solid-svg-icons';
import "./Post.css";

function Post({ post, currentUser, onLike, onDelete, isMyPost = false }) {
  const isOwner = currentUser && currentUser.id === post.ownerId;

  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(post.isLiked || false);

  // Fetch likes count and comments on component mount
  useEffect(() => {
    async function fetchPostData() {
      if (currentUser) {
        try {
          // Fetch likes count
          const count = await PetApi.getLikesCount(post.id);
          setLikeCount(count);

          // Fetch comments
          const fetchedComments = await PetApi.getComments(post.id);
          setComments(fetchedComments);
        } catch (err) {
          console.error("Error fetching post data:", err);
        }
      }
    }
    fetchPostData();
  }, [post.id, currentUser]);

  // Fetch like status on component mount
  useEffect(() => {
    async function fetchLikeStatus() {
      if (currentUser) {
        try {
          const isLiked = await PetApi.isPostLiked(post.id);
          setLiked(isLiked);
        } catch (err) {
          console.error("Error checking like status:", err);
        }
      }
    }
    fetchLikeStatus();
  }, [post.id, currentUser]);

  // Handle like/dislike action
  async function handleLike(postId) {
    if (!currentUser || !currentUser.id) {
      console.error("Error: User not authenticated or missing ID");
      return;
    }
    try {
      if (liked) {
        await PetApi.removeLike(postId); // Call the API to remove the like
        setLikeCount((prev) => prev - 1);
      } else {
        await PetApi.addLike(postId, { ownerId: currentUser.id }); // Call the API to add the like
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked); // Toggle the liked state
    } catch (err) {
      console.error("Error liking/disliking post:", err);
    }
  }

  return (
    <div className="Post">
      <h2>
        <Link to={`/posts/${post.id}`}>{post.content}</Link>
      </h2>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
      {/* <p class = "tweet info">{post.ownerId} - {post.createdAt}</p> */}

      <div className="Post-actions">
        {currentUser && (
          <>
            <button onClick={() => handleLike(post.id)} className={liked ? "like-button-pulse" : "like-button-outline"}>
              {liked ? '❤️' : '♡'} Like
              ({likeCount})
            </button>

            <button className="comment-button">
              <FontAwesomeIcon icon={fasComment} />
              <Link to={`/posts/${post.id}`}>Comment</Link>
            </button>

          </>
        )}

        {isMyPost && (
          <>
            <button>
              <Link to={`/posts/edit/${post.id}`}>Edit</Link>
            </button>
            <button onClick={() => onDelete(post.id)}>Delete</button>
          </>
        )}
      </div>

      {currentUser && (
        <div className="Post-comments">
          <h4>Comments:</h4>
          {comments.slice(-2).map(comment => (
            <div key={comment.id} className="Post-comment">
              <strong>{comment.username}</strong>: {comment.content}
            </div>
          ))}
          <Link to={`/posts/${post.id}`}>View all comments</Link>
        </div>
      )}
    </div>
  );

}
export default Post;