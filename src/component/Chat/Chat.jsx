"use client";
import React, { useState, useEffect } from "react";
import InputEmoji from "react-input-emoji";
import { useSession } from "next-auth/react";
import "./chat.css";

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const [isChatVisible, setChatVisible] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat?liveId=${props.liveId}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Auto-refresh every 5 sec

    return () => clearInterval(interval);
  }, [props.liveId]);

  const handleSend = async () => {
    if (text.trim() && session) {
      try {
        const messageData = {
          text,
          username: session?.user.username || "Anonymous",
          randomImage: session?.user.avatar || "/default-avatar.png",
          liveId: props.liveId,
        };

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) throw new Error("Failed to send message");

        setText(""); // Clear input field
        const newMessage = await response.json();
        setMessages([...messages, newMessage.messageData]); // Append new message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
    if (!session) {
      props.isLog(true);
    }
  };

  return (
    <div className="chtiE">
      {isChatVisible ? (
        <>
          <div className="chat-header">
            <button onClick={() => setChatVisible(false)}>Hide Chatbox</button>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <Message key={message.timestamp} message={message} />
            ))}
          </div>
          <div className="gropE">
            <div className="inputE">
              <InputEmoji
                value={text}
                placeholder="Send a message..."
                onChange={setText}
              />
            </div>
            <button onClick={handleSend} className="chat-send-button">
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="show-chat-button">
          <button onClick={() => setChatVisible(true)}>Show Chatbox</button>
        </div>
      )}
    </div>
  );
};

const Message = ({ message }) => {
  return (
    <div className="chat-message">
      <div className="chat-avatar">
        <img
          src={message.randomImage.replace(
            "https://cdn.noitatnemucod.net/avatar/100x100/",
            "https://img.flawlessfiles.com/_r/100x100/100/avatar/"
          )}
          alt="Avatar"
        />
      </div>
      <div className="chat-content">
        <div className="chat-username">{message.username}</div>
        <div className="chat-text">{message.text}</div>
      </div>
    </div>
  );
};

export default Chat;
