import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4 mt-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                <a href="#" className="hover:text-gray-300 mr-4">Terms of Service</a>
                <a href="#" className="hover:text-gray-300 mr-4">Privacy Policy</a>
                <a href="#" className="hover:text-gray-300">Contact Us</a>
                </div>
                <div className="text-sm">
                &copy; 2024 Zero Game Catalog. All rights reserved.
                </div>
            </div>
        </footer>
    );
};