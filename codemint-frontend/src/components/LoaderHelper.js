// LoaderHelper.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  width: 100%;
`;

const SpinnerText = styled.div`
  font-family: monospace;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
`;

const brailleSpinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const SpinningLoader = () => {
  const [spinnerChar, setSpinnerChar] = useState(brailleSpinnerChars[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSpinnerChar(prevChar => {
        const currentIndex = brailleSpinnerChars.indexOf(prevChar);
        const nextIndex = (currentIndex + 1) % brailleSpinnerChars.length;
        return brailleSpinnerChars[nextIndex];
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <LoaderWrapper>
      <SpinnerText>{spinnerChar} AI is thinking...</SpinnerText>
    </LoaderWrapper>
  );
};

export default SpinningLoader;
