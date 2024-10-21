import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


const socket = io('http://localhost:3000'); 

const App = () => {
  const [room, setRoom] = useState('general');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', room);
    
    socket.on('chatHistory', (history) => {
      setMessages(history);
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('chatHistory');
      socket.off('message');
    };
  }, [room]);

  const sendMessage = async () => {
    if (message) {
      const data = { room, username, message };
      socket.emit('chatMessage', data);
      setMessage('');
    }
  };

  return (
    <div className="chat-app">
      <h1>Chat Room: {room}</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;
