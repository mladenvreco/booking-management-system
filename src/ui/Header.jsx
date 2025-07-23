import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineCalendarDays,
  HiOutlineHomeModern,
  HiOutlineUsers,
  HiOutlinePrinter,
} from "react-icons/hi2";
import HeaderMenu from "./HeaderMenu";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import Logo from "./Logo";

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 4.8rem;
  background-color: var(--color-grey-100);
  box-shadow: var(--shadow-sm);

  @media (max-width: 768px) {
    padding: 1.2rem 2.4rem;
  }
`;

const LogoContanier = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 2.4rem;
  list-style: none;
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    flex-direction: column;
    gap: 1.6rem;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: var(--color-grey-100); /* Add background color */
    box-shadow: var(
      --shadow-sm
    ); /* Optional: Add shadow for better visibility */
    padding: 1.6rem;
    z-index: 1000;
  }
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  /* This works because react-router places the active class on the active NavLink */
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 2.4rem;
  color: var(--color-grey-600);
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{ position: "relative" }}>
      <HamburgerButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <HiX /> : <HiMenu />}
      </HamburgerButton>
      <NavList isOpen={isOpen}>
        <li>
          <StyledNavLink to="/pocetna" onClick={() => setIsOpen(false)}>
            <HiOutlinePrinter />
            <span>Preuzimanje</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/rezervacije" onClick={() => setIsOpen(false)}>
            <HiOutlineCalendarDays />
            <span>Rezervacije</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/bungalovi" onClick={() => setIsOpen(false)}>
            <HiOutlineHomeModern />
            <span>Bungalovi</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/kontrolna-tabla" onClick={() => setIsOpen(false)}>
            <LuLayoutDashboard />
            <span>Kontrolna tabla</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/korisnici" onClick={() => setIsOpen(false)}>
            <HiOutlineUsers />
            <span>Kreiraj korisnika</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

function Header() {
  return (
    <StyledHeader>
      <LogoContanier>
        <Logo size="8rem" />
      </LogoContanier>
      <MainNav />
      <HeaderMenu />
      {/* <Logo></Logo> */}
    </StyledHeader>
  );
}

export default Header;
