import { useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { context } from './context';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  const { user, authenticationLoading, logOut } = context();
  const [isOpen, setIsOpen] = useState(false);

  function toggleHandler() {
    setIsOpen(!isOpen);
  }

  return (
    <Container>
      <Navbar className="mb-4" color="light" light expand="md">
        <Link href="/"><a>Restaurant App Home</a></Link>
        <NavbarToggler onClick={() => toggleHandler()} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            {
              authenticationLoading && (
                <NavItem>
                  Loading...
                </NavItem>
              )
            }
            {
              ((user) && !authenticationLoading) && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    {user.email}
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem>
                      <Link href="/account"><a>Account</a></Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link href="/orders"><a>Orders</a></Link>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={logOut}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )
            }
            {
              ((!user) && !authenticationLoading) && (
                <>
                  <Link href="/createAccount"><a className="nav-link">Create Account</a></Link>
                  <Link href="/login"><a className="nav-link">Login</a></Link>
                </>
              )
            }
          </Nav>
        </Collapse>
      </Navbar>
      <div className={styles.appContainer} style={{ marginBottom: "40px"}}>
        {children}
      </div>

      <footer className={styles.footer}>
        <a
          href="https://russellpropert.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by Russell Propert
        </a>
      </footer>
    </Container>
  );
}