// src/components/MessageList.js
import React from 'react';
import styled from 'styled-components';

const MessageListWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
`;

const Message = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
  ${props => props.isUser ? `
    background-color: ${props.theme.colors.primary};
    align-self: flex-end;
    margin-left: auto;
  ` : `
    background-color: ${props.theme.colors.secondary};
    align-self: flex-start;
  `}
`;

const MessageList = ({ messages }) => {
  return (
    <MessageListWrapper>
      {messages.map((message, index) => (
        <Message key={index} isUser={message.role === 'user'}>
          {message.content}
        </Message>
      ))}
    </MessageListWrapper>
  );
};

export default MessageList;
