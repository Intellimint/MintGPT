import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { content: '⠋'; }
  10% { content: '⠙'; }
  20% { content: '⠹'; }
  30% { content: '⠸'; }
  40% { content: '⠼'; }
  50% { content: '⠴'; }
  60% { content: '⠦'; }
  70% { content: '⠧'; }
  80% { content: '⠇'; }
  90% { content: '⠏'; }
`;

const IndicatorWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 20px;
  font-size: 16px;
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
`;

const SpinnerChar = styled.span`
  font-family: monospace;
  font-size: 24px;
  margin-right: 10px;
  
  &::before {
    content: '⠋';
    animation: ${spin} 1s linear infinite;
  }
`;

const AIThinkingIndicator = () => {
  console.log('Rendering AI Thinking Indicator');
  
  return (
    <IndicatorWrapper>
      <SpinnerChar />
      AI is thinking...
    </IndicatorWrapper>
  );
};

export default AIThinkingIndicator;