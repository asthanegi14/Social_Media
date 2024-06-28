import profile from '../assets/profile.jpeg';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import Comment from './Comment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [liked, setLiked] = useState({});
    const [comment, setComment] = useState({});
    const [commentTxt, setCommentText] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    useEffect(() => {
        console.log("backendUrl = " + backendUrl);
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${backendUrl}/getAllPosts`);
                setPosts(response.data);
            } catch (error) {
                console.error("There was an error fetching the posts!", error);
            }
        };

        fetchPosts();
    }, [backendUrl]);

    const handleLike = async (postId) => {
        const isLiked = !liked[postId];
        setLiked({ ...liked, [postId]: isLiked });

        try {
            const response = await axios.post(`${backendUrl}/updateLike`, { postId, isLiked });
            if (response.data.success) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId ? { ...post, likes: response.data.likes } : post
                    )
                );
            }
        } catch (error) {
            console.error("There was an error updating the like!", error);
        }
    };

    const handleComment = (postId) => {
        setComment({ ...comment, [postId]: !comment[postId] });
    };

    const handlePostComment = async (postId) => {
        if (!commentTxt.trim()) return;

        try {
            const response = await axios.post(`${backendUrl}/addComment`, { postId, comment: commentTxt });
            if (response.data.success) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId ? { ...post, comments: response.data.comments } : post
                    )
                );
                setCommentText('');
                setComment({ ...comment, [postId]: false });
                toast.success("Comment posted sucessfully");
            }
        } catch (error) {
            console.error("There was an error adding the comment!", error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const response = await axios.delete(`${backendUrl}/deletePost/${postId}`);
            if (response.data.success) {
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

                toast.success("Post Deleted");
            }
        } catch (error) {
            console.error("There was an error deleting the post!", error);
        }
    };

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    return (
        <div className='flex flex-col gap-4'>
            <ToastContainer />
            {posts.map(post => (
                <div key={post._id} className='flex flex-col justify-start items-left bg-slate-200 p-4 rounded gap-2'>
                    <div className="flex gap-4">
                        <img src={post.userImage ? `${backendUrl}${post.userImage}` : profile} alt="Profile" className='w-14 h-14 rounded-full' />
                        <div className='flex flex-col justify-letf items-left'>
                            <h2 className='font-bold'>{post.name}</h2>
                            <p className="text-red-400 cursor-pointer" onClick={() => handleDeletePost(post._id)}>Delete post</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className='flex flex-wrap text-sm'>{post.description}</p>
                        <img src={`${backendUrl}${post.image}`} alt="post" className='w-full object-cover aspect-square rounded' />
                    </div>
                    <div className='flex justify-around'>
                        {liked[post._id] ?
                            <FcLike className='w-10 cursor-pointer' onClick={() => handleLike(post._id)} /> :
                            <FaRegHeart className='w-10 cursor-pointer' onClick={() => handleLike(post._id)} />}
                        <FaRegComment className='w-10 cursor-pointer' onClick={() => handleComment(post._id)} />
                    </div>
                    <div className='flex justify-around text-sm'>
                        <p>{post.likes} Likes</p>
                        <p>{post.comments.length} Comments</p>
                    </div>
                    {comment[post._id] && (
                        <div className='flex flex-col justify-between items-center gap-2 mt-2'>
                            <Comment postId={post._id} />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder='Write your comment'
                                    className='py-2 px-4 w-full rounded outline-none'
                                    value={commentTxt}
                                    onChange={handleCommentChange}
                                />
                                <div className='flex gap-2 items-center'>
                                    <button
                                        type='submit'
                                        className='bg-blue-500 text-white py-2 px-4 rounded'
                                        onClick={() => handlePostComment(post._id)}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
