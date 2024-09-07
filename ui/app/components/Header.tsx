import React from "react";

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">Logo</div>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="#" className="hover:text-gray-300">Home</a></li>
                        <li><a href="#" className="hover:text-gray-300">Catalog</a></li>
                        <li><a href="#" className="hover:text-gray-300">About</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

