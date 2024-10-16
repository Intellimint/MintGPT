import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const TextArea = styled.textarea`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 15px;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  resize: none;
  min-height: 20px;
  max-height: 200px;
  overflow-y: auto;
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;

  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  cursor: pointer;
  align-self: flex-end;
`;

const ChatWindow = ({ initialMessages = [], onMessagesUpdate = () => {} }) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    console.log('Initial messages:', initialMessages);
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputMessage]);

  const updateMessages = useCallback((newMessages) => {
    console.log('Updating messages:', newMessages);
    onMessagesUpdate(newMessages);
  }, [onMessagesUpdate]);

  useEffect(() => {
    updateMessages(messages);
  }, [messages, updateMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, userMessage];
        console.log('New messages after user input:', newMessages);
        return newMessages;
      });
      setInputMessage('');
      setIsLoading(true);

      const aiResponse = await sendMessageToAI(inputMessage);
      const aiMessage = { role: 'assistant', content: aiResponse };
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, aiMessage];
        console.log('New messages after AI response:', newMessages);
        return newMessages;
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
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
        <TextArea
          ref={textAreaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={isLoading}
        />
        <SendButton onClick={handleSendMessage} disabled={isLoading}>
          Send
        </SendButton>
      </InputWrapper>
    </ChatWindowWrapper>
  );
};

export default ChatWindow;
