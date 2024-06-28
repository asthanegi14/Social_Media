import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

function NavbarComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <Navbar bg="light" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">Facebook</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isLoggedIn ? (
                        <Nav className="ms-auto gap-2">
                            <Nav.Link onClick={handleLogout} className="bg-red-400 rounded text-white px-4 w-fit">Logout</Nav.Link>
                        </Nav>
                    ) : (
                        <Nav className="ms-auto gap-2">
                            <Nav.Link href="/signup" className="border rounded px-4 w-fit">Sign Up</Nav.Link>
                            <Nav.Link href="/login" className="bg-blue-400 rounded text-white px-4 w-fit">Login</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
