import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from './theme';
import ConversationManager from './components/ConversationManager';
import SignUpForm from './components/SignUpForm';

// You can add more component imports here as needed
// import SomeNewComponent from './components/SomeNewComponent';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
  * {
    box-sizing: border-box;
  }
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const NavWrapper = styled.nav`
  padding: 10px;
  background-color: ${props => props.theme.colors.primary};
`;

const NavLink = styled.button`
  color: ${props => props.theme.colors.text};
  margin-right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    text-decoration: underline;
  }
`;

// This object maps routes to components
const routeComponentMap = {
  '/': ConversationManager,
  '/signup': SignUpForm,
  // Add more routes here as needed
  // '/some-new-route': SomeNewComponent,
};

function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // For future auth implementation

  const navigate = (route) => {
    setCurrentRoute(route);
    window.history.pushState(null, '', route);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // You can add more useEffect hooks here for additional functionality
  // For example, checking authentication status

  const CurrentComponent = routeComponentMap[currentRoute] || (() => <div>404 Not Found</div>);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppWrapper>

        <CurrentComponent isAuthenticated={isAuthenticated} />
        {/* You can add more global components here, like a footer */}
      </AppWrapper>
    </ThemeProvider>
  );
}

export default App;