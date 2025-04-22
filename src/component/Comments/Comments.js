"use client";

import { useEffect, useState } from "react";
import InputEmoji from "react-input-emoji";
import "./comments.css";

export default function CommentPage() {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyInputs, setReplyInputs] = useState({}); // track reply input for each comment

  const fetchComments = async () => {
    const res = await fetch("/api/comments");
    const data = await res.json();
    setComments(data);
  };

  const postComment = async (text, parentId = null) => {
    if (!text.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, parentId }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      if (parentId) {
        setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
      } else {
        setCommentText("");
      }
    }
  };

  const handleLikeDislike = async (commentId, action) => {
    const res = await fetch(`/api/comments/?commentId=${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      const updatedComment = await res.json();
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
    }
  };

  const renderComments = () => {
    return comments.map((comment) => {
      const parent = comments.find((c) => c._id === comment.parentId);
      return (
        <div key={comment._id} className="comment-item flat">
          <div className="comment-header">
            <img
              src={comment.avatar || "/default-avatar.png"}
              alt={comment.username}
              className="comment-avatar"
            />
            <div className="comment-user">
              <strong>@{comment.username}</strong>
              <span className="comment-time">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="comment-text">
            {comment.parentId && parent ? (
              <strong>@{parent.username}: </strong>
            ) : null}
            {comment.text}
          </div>

          <div className="comment-actions">
            <button
              onClick={() => handleLikeDislike(comment._id, "like")}
              className="like-btn"
            >
              👍 {comment.likes}
            </button>
            <button
              onClick={() => handleLikeDislike(comment._id, "dislike")}
              className="dislike-btn"
            >
              👎 {comment.dislikes}
            </button>
            <button
              onClick={() =>
                setReplyInputs((prev) => ({
                  ...prev,
                  [comment._id]: prev[comment._id] ? "" : "",
                }))
              }
              className="reply-btn"
            >
              Reply
            </button>
          </div>

          {/* Reply Input */}
          {replyInputs.hasOwnProperty(comment._id) && (
            <div className="reply-input">
              <InputEmoji
                value={replyInputs[comment._id]}
                onChange={(val) =>
                  setReplyInputs((prev) => ({ ...prev, [comment._id]: val }))
                }
                placeholder="Write a reply..."
              />
              <button
                onClick={() =>
                  postComment(replyInputs[comment._id], comment._id)
                }
                className="send-button"
              >
                Send
              </button>
            </div>
          )}
        </div>
      );
    });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="comment-container">
      <h1 className="comment-title">Comment Section</h1>

      <div className="input-wrapper">
        <InputEmoji
          value={commentText}
          onChange={setCommentText}
          placeholder="Leave a comment"
        />
        <button onClick={() => postComment(commentText)} className="send-button">
          Send
        </button>
      </div>

      <div className="comments-list">{renderComments()}</div>
    </div>
  );
}
