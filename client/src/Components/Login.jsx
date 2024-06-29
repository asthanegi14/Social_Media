import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${backendUrl}/login`, {
                username,
                password,
            });
            if (response.data.message === 'User not found') {
                toast.error("User not found");
            } else if (response.data.message === "Wrong password") {
                toast.error("Wrong password");
            } else if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('userId', response.data.user.userId); // Store userId separately
                await toast.success("Login Successfully");
                navigate('/home');
            }
        } catch (e) {
            toast.error("Error logging in user");
        }
    };

    return (
        <div className='flex flex-col items-center bg-slate-300 h-full w-full p-12'>
            <ToastContainer />
            <Form onSubmit={handleSubmit} className='flex flex-col sm:w-[40%] w-full gap-4 border-2 bg-gray-200 p-8 rounded'>
                <h1 className='text-2xl font-bold text-center'>Login</h1>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
                <p className='flex text-sm text-nowrap gap-2'>Do not have an account? <Link to="/signup" className='text-red-400 text-nowrap'>Sign Up</Link></p>

                <p className='flex text-sm text-nowrap gap-2'>Forgot Password? <Link to="/updatepassword" className='text-red-400 text-nowrap'>Update Password</Link></p>
            </Form>
        </div>
    );
}

export default Login;
