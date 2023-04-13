import { Outlet, Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { GiTakeMyMoney } from 'react-icons/gi';

export default function Layout() {
    return (
        <>
            <Navbar collapseOnSelect expand="sm" variant="dark" className="prevent-select">
                <Container>
                    <Link to="/" className="logo navbar-brand">
                        <GiTakeMyMoney />Portmonetka
                    </Link>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Link to="/about" className="nav-link">
                                About
                            </Link>
                            <Link to="/contact" className="nav-link">
                                Contact
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Outlet />
        </>
    )
}
