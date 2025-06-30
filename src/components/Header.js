import React from 'react';
import styled from 'styled-components';
import logo from '../images/Tredils.jpg';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.alignCenter ? 'center' : 'space-between')};
  padding: 20px;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.secondary};
  width: 100%;
  box-sizing: border-box;
  position: relative;
  @media (max-width: 768px) {
    flex-direction: column; 
    text-align: center;
    padding: 15px;
  }
`;

const Logo = styled.img`
  height: 50px;
  margin-right: 20px;

  @media (max-width: 768px) {
    height: 40px; 
    margin-bottom: 10px;
  }
`;

const BankName = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  margin: 0;
  color: ${(props) => props.theme.colors.secondary};

  @media (max-width: 768px) {
    font-size: 20px; 
  }
`;

const Header = ({ showLogo = true, alignCenter = false }) => (
  <HeaderContainer alignCenter={alignCenter}>
    {showLogo && <Logo src={logo} alt="Tresdils Bank Logo" />}
    <BankName>Tresdils</BankName>
  </HeaderContainer>
);

export default Header;
