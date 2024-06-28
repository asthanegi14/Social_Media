import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import defaultImage from '../assets/defaultImg.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddPost() {
    const [image, setImage] = useState(defaultImage);
    const [previewImage, setPreviewImage] = useState(defaultImage);
    const [postData, setPostData] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const user = JSON.parse(localStorage.getItem('user'));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handlePostChange = (e) => {
        setPostData(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);
        formData.append('postData', postData);
        formData.append('username', user?.name);
        formData.append('userImage', user?.image);

        try {
            const response = await axios.post(`${backendUrl}/post`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message === "Post added successfully!") {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            console.error("There was an error posting!", e);
            toast.error("There was an error posting!");
        }
    };

    const renderTextWithHash = (text) => {
        const parts = text.split(/(#[^\s]+)/g);
        return parts.map((part, index) =>
            part.startsWith('#') ? <span key={index} style={{ color: 'blue' }}>{part}</span> : part
        );
    };

    return (
        <div className='flex flex-col items-center bg-slate-300 h-full w-full p-10'>
            <ToastContainer />
            <Form onSubmit={handleSubmit} className='flex flex-col sm:w-[40%] w-full gap-4 border-2 bg-gray-200 p-10 rounded' encType="multipart/form-data">
                <h1 className='text-2xl font-bold text-center'>Add a Post</h1>

                <Form.Group controlId="formPostData">
                    <Form.Control as="textarea" rows={10} placeholder="Enter your post here" value={postData}
                        onChange={handlePostChange} />
                    <div className='mt-2'>
                        {renderTextWithHash(postData)}
                    </div>
                </Form.Group>

                <Form.Group controlId="formBasicImage">
                    <Form.Label>Upload an Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} id="image" />
                </Form.Group>

                <img src={previewImage} alt="profile" className='rounded self-center border-2 border-gray-400 object-cover' style={{ width: '150px', height: '150px' }} />

                <Button variant="primary" type="submit">
                    Add this post
                </Button>
            </Form>
        </div>
    );
}

export default AddPost;
