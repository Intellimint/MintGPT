import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Trash2 } from 'react-feather'; // We'll use Feather icons
import ChatWindow from './ChatWindow';

const ConversationManagerWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const SidebarWrapper = styled.div`
  width: 250px;
  min-width: 250px;
  background-color: ${props => props.theme.colors.secondary};
  padding: 20px;
  overflow-y: auto;
`;

const ConversationList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ConversationItem = styled.li`
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}33; // 20% opacity
  }
`;

const ConversationTitle = styled.span`
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeleteIcon = styled(Trash2)`
  opacity: 0.5;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const NewChatButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 20px;
  cursor: pointer;
`;

const ChatWindowWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const ConversationManager = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  useEffect(() => {
    const loadConversations = () => {
      const savedConversations = localStorage.getItem('conversations');
      console.log('Loaded from localStorage:', savedConversations);
      if (savedConversations) {
        try {
          const parsedConversations = JSON.parse(savedConversations);
          setConversations(parsedConversations);
          console.log('Parsed conversations:', parsedConversations);
          if (parsedConversations.length > 0) {
            setCurrentConversationId(parsedConversations[parsedConversations.length - 1].id);
          } else {
            createNewConversation();
          }
        } catch (error) {
          console.error('Error parsing conversations:', error);
          createNewConversation();
        }
      } else {
        createNewConversation();
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    const saveConversations = () => {
      console.log('Saving conversations:', conversations);
      localStorage.setItem('conversations', JSON.stringify(conversations));
    };

    if (conversations.length > 0) {
      saveConversations();
    }
  }, [conversations]);

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      messages: [],
      title: `Conversation ${conversations.length + 1}`,
    };
    setConversations(prevConversations => [...prevConversations, newConversation]);
    setCurrentConversationId(newConversation.id);
    console.log('Created new conversation:', newConversation);
  };

  const selectConversation = (id) => {
    setCurrentConversationId(id);
    console.log('Selected conversation:', id);
  };

  const updateConversation = (id, newMessages) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === id ? { ...conv, messages: newMessages } : conv
      )
    );
    console.log('Updated conversation:', id, 'with messages:', newMessages);
  };

  const deleteConversation = (id) => {
    setConversations(prevConversations => prevConversations.filter(conv => conv.id !== id));
    if (currentConversationId === id) {
      const remainingConversations = conversations.filter(conv => conv.id !== id);
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[remainingConversations.length - 1].id);
      } else {
        createNewConversation();
      }
    }
    console.log('Deleted conversation:', id);
  };

  const currentConversation = conversations.find(conv => conv.id === currentConversationId) || { messages: [] };

  return (
    <ConversationManagerWrapper>
      <SidebarWrapper>
        <NewChatButton onClick={createNewConversation}>New Chat</NewChatButton>
        <ConversationList>
          {conversations.map(conv => (
            <ConversationItem key={conv.id}>
              <ConversationTitle onClick={() => selectConversation(conv.id)}>
                {conv.title}
              </ConversationTitle>
              <DeleteIcon 
                size={18} 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
              />
            </ConversationItem>
          ))}
        </ConversationList>
      </SidebarWrapper>
      <ChatWindowWrapper>
        <ChatWindow
          key={currentConversationId}
          initialMessages={currentConversation.messages}
          onMessagesUpdate={(newMessages) => updateConversation(currentConversationId, newMessages)}
        />
      </ChatWindowWrapper>
    </ConversationManagerWrapper>
  );
};

export default ConversationManager;
