// src/components/NavBar2.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar2 = () => {
    const { logout, user } = useAuth(); // Destructure user from context
   
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        logout(); // Call the logout function from context
    };

    return (
        <header className="w-full bg-green-500 flex flex-wrap items-center shadow-md fixed top-0 left-0">
            <div className="flex-1 flex justify-between items-center">
                <a href="#home">
                    <img src="" alt="logo" className="h-10 w-16"/>
                </a>
                {/* Show the user’s name if logged in */}
                {user && <span className="text-white p-4">Welcome, {user.firstname}</span>}
            </div>
            <div>
                <nav>
                    <ul className="flex items-center justify-between text-base text-white">
                        <li><Link to="/admin-dashboard" className="p-4">TodoList</Link></li>
                        <li>
                            <button onClick={handleLogout} className="p-4">Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default NavBar2;
