import { useEffect, useState } from 'react';
// Hint: You need to import chatService here
// import { chatService } from './chatService';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Fix the input focus: The "Focus Input" button in ChatRoom should focus the input inside ChatForm.
 * 2. Fix the connection: Ensure it connects to the right room and DISCONNECTS properly.
 * 3. Fix welcome messages: Replace "Stub Welcome" with the 2 messages from chatService.
 * 4. Fix message sending: Ensure messages are added correctly without stale state issues.
 */

const ChatForm = ({ onSend }) => {
  const [text, setText] = useState('');

  // TODO: This component needs to expose its input ref to the parent

  return (
    <div
      className="chat-form"
      style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px' }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        onClick={() => {
          onSend(text);
          setText('');
        }}
      >
        Send
      </button>
    </div>
  );
};

export default function ChatRoom() {
  const [roomId, setRoomId] = useState('general');
  const [messages, setMessages] = useState([]);
  const [welcomeMessages, setWelcomeMessages] = useState([
    'Stub Welcome 1',
    'Stub Welcome 2',
  ]);

  // ANTI-PATTERN: This effect is slightly broken and doesn't handle cleanup
  useEffect(() => {
    console.log('Effect running for room:', roomId);
    // chatService.connect(roomId);
  }, [roomId]);

  // TODO: Fetch welcome messages from chatService whenever roomId changes

  const handleSend = (text) => {
    // POTENTIAL BUG: Stale closure or incorrect state update?
    setMessages([...messages, text]);
  };

  return (
    <div
      className="chat-room-container"
      style={{ padding: '20px', maxWidth: '400px' }}
    >
      <h1>Chat Room</h1>

      <label>
        Choose Room:{' '}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">General</option>
          <option value="music">Music</option>
          <option value="travel">Travel</option>
        </select>
      </label>

      <div
        className="welcome-section"
        style={{ background: '#f0f0f0', margin: '10px 0', padding: '10px' }}
      >
        {welcomeMessages.map((msg, i) => (
          <p key={i}>
            <strong>{msg}</strong>
          </p>
        ))}
      </div>

      <div
        className="messages-list"
        style={{
          height: '150px',
          overflowY: 'auto',
          border: '1px solid #eee',
          padding: '5px',
        }}
      >
        {messages.length === 0 && <em>No messages yet...</em>}
        {messages.map((m, i) => (
          <div key={i} className="message-item">
            {m}
          </div>
        ))}
      </div>

      <ChatForm onSend={handleSend} />

      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => {
            // TODO: Focus the input inside ChatForm
            alert('Implement focus logic!');
          }}
        >
          Focus Input
        </button>
      </div>
    </div>
  );
}
