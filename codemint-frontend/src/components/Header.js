import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
`;

const Logo = styled.img`
  height: 40px;
  margin-right: 15px;
`;

const Title = styled.h1`
  font-size: 1.5em;
  color: ${props => props.theme.colors.primary};
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <Logo src="/path-to-your-logo.png" alt="Intellimint AI Logo" />
      <Title>Intellimint AI</Title>
    </HeaderWrapper>
  );
};

export default Header;