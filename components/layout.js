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
  const { user, loading, logOut } = context();
  const [isOpen, setIsOpen] = useState(false);

  function toggleHandler() {
    setIsOpen(!isOpen);
  }

  return (
    <Container>
      <div className={styles.flexWrapper}>
        <Navbar className="mb-4" color="light" light expand="md">
          <Link href="/"><a>Restaurant App</a></Link>
          <NavbarToggler onClick={() => toggleHandler()} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ms-auto" navbar>
              {
                loading && (
                  <NavItem>
                    Loading...
                  </NavItem>
                )
              }
              {
                (user && !loading) && (
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
                (!user && !loading) && (
                  <>
                    <Link href="/createAccount"><a className="nav-link">Create Account</a></Link>
                    <Link href="/login"><a className="nav-link">Login</a></Link>
                  </>
                )
              }
            </Nav>
          </Collapse>
        </Navbar>
        <Container className={styles.appContainer}>
          {children}
        </Container>

        <footer className={styles.footer}>
          <a
            href="https://russellpropert.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Created by Russell Propert
          </a>
        </footer>
      </div>
    </Container>
  );
}