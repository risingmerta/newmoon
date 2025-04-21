'use client';

import { useEffect, useState } from 'react';
import './comments.css';

export default function CommentPage() {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const res = await fetch('/api/comments');
    const data = await res.json();
    setComments(data);
  };

  const postComment = async (text, parentId = null) => {
    if (!text.trim()) return;

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, parentId }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    }
  };

  const renderComments = () => {
    return comments.map((comment) => {
      const parent = comments.find((c) => c._id === comment.parentId);
      return (
        <div key={comment._id} className="comment-item flat">
          <div className="comment-text">
            {comment.parentId && parent ? (
              <strong>@{parent.userId}: </strong>
            ) : null}
            {comment.text}
          </div>
          <button
            onClick={() => {
              const reply = prompt("Reply:");
              if (reply) postComment(reply, comment._id);
            }}
            className="reply-btn"
          >
            Reply
          </button>
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
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Leave a comment"
          className="comment-input"
        />
        <button
          onClick={() => postComment(commentText)}
          className="send-button"
        >
          Send
        </button>
      </div>

      <div className="comments-list">{renderComments()}</div>
    </div>
  );
}
