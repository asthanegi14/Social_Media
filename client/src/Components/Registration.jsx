import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import defaultImage from '../assets/defaultImg.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function Registration() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(defaultImage);
    const [previewImage, setPreviewImage] = useState(defaultImage);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('image', image);

        try {
            const response = await axios.post(`${backendUrl}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message == "User registered successfully!") {
                toast.success(response.data.message);
            }
            else {
                toast.error(response.data.message);
            }
        }
        catch (e) {
            console.error("There was an error registering the user!", e);
            toast.error("There was an error registering the user!", e);
        }
    };

    return (
        <div className='flex flex-col items-center bg-slate-300 h-full w-full p-10'>
            <ToastContainer />
            <Form onSubmit={handleSubmit} className='flex flex-col sm:w-[40%] w-full gap-4 border-2 bg-gray-200 p-10 rounded' encType="multipart/form-data">
                <h1 className='text-2xl font-bold text-center'>Sign Up</h1>

                <img src={previewImage} alt="profile" className='rounded-full border-2 border-gray-400 self-center object-cover' style={{ width: '150px', height: '150px' }} />

                <Form.Group controlId="formBasicImage">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} id="image" />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email address" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Sign Up
                </Button>
                <p className='flex text-sm text-nowrap gap-2'>Already have an account? <Link to="/login" className='text-red-400 text-nowrap'>Login</Link></p>
            </Form>
        </div>
    );
}

export default Registration;
