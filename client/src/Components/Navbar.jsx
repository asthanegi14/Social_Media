import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';

function NavbarComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <Navbar bg="light" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/home">Facebook</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isLoggedIn ? (
                        <Nav className="ms-auto gap-2">
                            <Nav.Link onClick={handleLogout} className="bg-red-400 rounded text-white px-4 w-fit">Logout</Nav.Link>
                        </Nav>
                    ) : (
                        <Nav className="ms-auto gap-2">
                            <Nav.Link as={Link} to="/signup" className="border rounded px-4 w-fit">Sign Up</Nav.Link>
                            <Nav.Link as={Link} to="/" className="bg-blue-400 rounded text-white px-4 w-fit">Login</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
