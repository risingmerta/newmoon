import React from 'react'
import './notification.css' // Import the global CSS file

const Notification = () => {
  return (
    <div className="notification-container">
      <div className="notification-header">
        <h1 className="notification-title">Coming Soon</h1>
        <p className="notification-description">We're working hard to bring you something amazing. Stay tuned!</p>
        <div className="notification-subscribe">
          <input type="email" placeholder="Enter your email" className="notification-input" />
          <button className="notification-button">Notify Me</button>
        </div>
      </div>
    </div>
  )
}

export default Notification
