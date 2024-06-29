import { useState, useEffect } from 'react';
import defaultImg from '../assets/defaultImg.png';
import { Link } from 'react-router-dom';
import Posts from './Posts';

export default function Home() {
    const [user, setUser] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchUserFromLocalStorage = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };

        fetchUserFromLocalStorage();
    }, []);

    const userImageSrc = user?.image ? `${backendUrl}/${user.image}` : defaultImg;

    return (
        <div className='flex flex-col items-center bg-slate-300 h-full w-full p-10'>
            <div className='flex flex-col sm:w-[40%] w-full gap-4'>
                <div className='flex flex-col justify-start items-left bg-slate-200 p-4 rounded gap-2'>
                    <div className='flex gap-4'>
                        <img
                            src={userImageSrc}
                            alt="your dp"
                            className='rounded-full border-2 border-gray-400 w-14 h-14 object-cover'
                            onError={(e) => e.target.src = defaultImg}
                        />
                        <div>
                            <h1 className='font-bold'>{user?.name || "User Name"}</h1>
                            <Link to='/addpost' className='text-sm text-blue-800'>Add a post</Link>
                        </div>
                    </div>
                </div>
                <Posts />
            </div>
        </div>
    );
}
