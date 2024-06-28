import { useState, useEffect } from 'react';
import axios from 'axios';
import profile from '../assets/profile.jpeg';
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";

const Comment = ({ postId }) => {
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState('');
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

    const handlePostLike = async () => {
        try {
            const response = await axios.post(`${backendUrl}/updateLike`, { postId });
            if (response.data.success) {
                setPost((prevPost) => ({
                    ...prevPost,
                    likes: response.data.likes
                }));
            }
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    const handleToggleComment = () => {
        // Implement if you want to toggle comment input display
    };

    const handlePostComment = async () => {
        if (!commentText.trim()) return;

        try {
            const response = await axios.post(`${backendUrl}/addComment`, { postId, text: commentText });
            if (response.data.success) {
                setPost((prevPost) => ({
                    ...prevPost,
                    comments: response.data.comments
                }));
                setCommentText('');
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className='flex flex-col gap-4'>
            <div className='mt-4'>
                <h3 className='text-lg font-bold'>Comments</h3>
                {post.comments.map((comment, index) => (
                    <div key={index} className='flex justify-start items-center gap-2 mt-2'>
                        <img src={comment.userImage ? `${backendUrl}${comment.userImage}` : profile} alt="Profile" className='w-10 h-10 rounded-full' />
                        <div>
                            <p className='text-sm font-bold'>{comment.username}</p>
                            <p className='text-sm'>{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comment;
