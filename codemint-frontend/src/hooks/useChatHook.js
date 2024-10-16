// hooks/useChatHook.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const useChatHook = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (content) => {
    setError(null);
    try {
      setMessages(prevMessages => [...prevMessages, { role: 'user', content }]);
      setIsAiThinking(true);

      const response = await axios.post('http://localhost:8000/chat', {
        session_id: sessionId,
        message: content
      }, {
        timeout: 500000
      });

      if (response.data && response.data.message) {
        setIsAiThinking(false);
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: response.data.message }]);
        setSessionId(response.data.session_id);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setIsAiThinking(false);
      const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred';
      setError(`Error: ${errorMessage}`);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'I encountered an error. Please try again.' }]);
    }
  }, [sessionId]);

  return {
    messages,
    isAiThinking,
    error,
    sendMessage
  };
};

export default useChatHook;
