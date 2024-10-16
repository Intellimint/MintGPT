import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import EnhancedMessage from './MessageHelper';
import SpinningLoader from './LoaderHelper';

const ChatWindowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const MessagesWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  padding: 20px;
  background-color: ${props => props.theme.colors.inputBackground};
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  cursor: pointer;
`;

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessageToAI = async (message) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/chat', { 
        message,
        session_id: sessionId
      });
      setSessionId(response.data.session_id);
      return response.data.message;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      return 'Sorry, I encountered an error. Please try again.';
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      const userMessage = { role: 'user', content: inputMessage };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputMessage('');
      setIsLoading(true);

      const aiResponse = await sendMessageToAI(inputMessage);
      const aiMessage = { role: 'assistant', content: aiResponse };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsLoading(false);
    }
  };

  return (
    <ChatWindowWrapper>
      <MessagesWrapper>
        {messages.map((message, index) => (
          <EnhancedMessage
            key={index}
            content={message.content}
            isUser={message.role === 'user'}
          />
        ))}
        {isLoading && <SpinningLoader />}
        <div ref={messagesEndRef} />
      </MessagesWrapper>
      <InputWrapper>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%' }}>
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <SendButton type="submit" disabled={isLoading}>
            Send
          </SendButton>
        </form>
      </InputWrapper>
    </ChatWindowWrapper>
  );
};

export default ChatWindow;