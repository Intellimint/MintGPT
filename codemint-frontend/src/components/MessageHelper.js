import React, { memo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Copy, Check, ThumbsUp, ThumbsDown } from 'react-feather';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import { theme } from '../theme';

// Styled components for messages and code blocks
const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${props => (props.$isUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
  width: 100%;
`;

const Message = styled.div`
  background-color: ${props => (props.$isUser ? props.theme.colors.primary : props.theme.colors.secondary)};
  color: ${props => props.theme.colors.text};
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 80%;
  word-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const CodeBlockWrapper = styled.div`
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #2d2d2d;
  border-radius: 4px;
  overflow: hidden;
`;

const CodeBlock = styled.pre`
  padding: 10px 10px 10px 3.8em;
  margin: 0;
  font-family: 'Fira code', 'Fira Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  counter-reset: line;

  code {
    display: block;
    position: relative;

    &::before {
      content: counter(line);
      counter-increment: line;
      position: absolute;
      left: -3em;
      width: 2.5em;
      text-align: right;
      color: rgba(255, 255, 255, 0.4);
    }
  }
`;

// Update the CopyButton styled component to use Feather icons
const CopyButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: ${props => props.theme.colors.primary};
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: 0.8rem;
  padding: 5px 8px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    opacity: 1;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

// Updated ResponseActions component with Feather icons
const ResponseActions = ({ content }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleThumbsUp = () => {
    console.log('Thumbs up clicked');
    // Implement thumbs up logic here
  };

  const handleThumbsDown = () => {
    console.log('Thumbs down clicked');
    // Implement thumbs down logic here
  };

  return (
    <ActionsWrapper>
      <ActionButton onClick={handleCopy} title="Copy full response">
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </ActionButton>
      <ActionButton onClick={handleThumbsUp} title="Thumbs up">
        <ThumbsUp size={16} />
      </ActionButton>
      <ActionButton onClick={handleThumbsDown} title="Thumbs down">
        <ThumbsDown size={16} />
      </ActionButton>
    </ActionsWrapper>
  );
};

// Main component with code highlighting and response actions
const EnhancedMessage = memo(({ content, isUser }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatContent = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const boldTextRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let codeBlockIndex = 0;

    // Handle code blocks and bold text
    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const nonCodeBlockText = text.slice(lastIndex, match.index);
        const nonCodeWithBold = nonCodeBlockText.split(boldTextRegex).map((part, index) => {
          return index % 2 === 1 ? <strong key={`bold-${index}`}>{part}</strong> : part;
        });
        parts.push(<div key={lastIndex}>{nonCodeWithBold}</div>);
      }

      const language = match[1] || 'text';
      const code = match[2].trim();

      const highlightedCode = Prism.highlight(
        code,
        Prism.languages[language] || Prism.languages.text,
        language
      );

      parts.push(
        <CodeBlockWrapper key={match.index}>
          <CopyButton onClick={() => copyToClipboard(code, codeBlockIndex)}>
            {copiedIndex === codeBlockIndex ? (
              <>
                <Check size={14} />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </CopyButton>
          <CodeBlock className={`language-${language}`}>
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </CodeBlock>
        </CodeBlockWrapper>
      );

      lastIndex = match.index + match[0].length;
      codeBlockIndex++;
    }

    // Handle remaining non-code text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      const remainingWithBold = remainingText.split(boldTextRegex).map((part, index) => {
        return index % 2 === 1 ? <strong key={`bold-${index}`}>{part}</strong> : part;
      });
      parts.push(<div key={lastIndex + text.length}>{remainingWithBold}</div>);
    }

    return parts;
  };

  return (
    <ThemeProvider theme={theme}>
      <MessageWrapper $isUser={isUser}>
        <Message $isUser={isUser}>
          {formatContent(content)}
          {!isUser && <ResponseActions content={content} />}
        </Message>
      </MessageWrapper>
    </ThemeProvider>
  );
});

export default EnhancedMessage;
