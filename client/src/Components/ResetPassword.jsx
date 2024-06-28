import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !newPassword || !confirmNewPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem('resetToken');

            const response = await axios.put(`${backendUrl}/updatePassword`, {
                email,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("Error resetting password");
        }
    };

    return (
        <div className='flex flex-col items-center bg-slate-300 h-full w-full p-10'>
            <ToastContainer />
            <Form onSubmit={handleSubmit} className='flex flex-col sm:w-[40%] w-full gap-4 border-2 bg-gray-200 p-10 rounded'>
                <h1 className='text-2xl font-bold text-center'>Reset Password</h1>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Your Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicConfirmNewPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Reset Password
                </Button>
                <p className='flex text-sm gap-2 justify-center'>Remember your password? <Link to="/login" className='text-red-400'>Login</Link></p>
            </Form>
        </div>
    );
}

export default ResetPassword;
