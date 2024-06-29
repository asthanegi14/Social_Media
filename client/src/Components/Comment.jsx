import { useState, useEffect } from 'react';
import axios from 'axios';
import profile from '../assets/profile.jpeg';

const Comment = ({ postId }) => {
    const [post, setPost] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${backendUrl}/getPost/${postId}`);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [backendUrl, postId]);

    if (!post) return <div>Loading...</div>;

    return (
        <div className='flex flex-col gap-4'>
            <div className='mt-4'>
                <h3 className='text-lg font-bold'>Comments</h3>
                {post.comments.map((comment, index) => (
                    <div key={index} className='flex justify-start items-center gap-2 mt-2'>
                        <img src={comment.userImage ? `${backendUrl}/${comment.userImage}` : profile} alt="Profile" className='w-10 h-10 rounded-full' />
                        <div>
                            <p className='text-sm font-bold'>{comment.name}</p>
                            <p className='text-sm'>{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comment;
