import React from 'react';
import { UserContext } from '../../context/UserContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import UserInfoTest from '../UserInfoTest';
import ThemeToggle from '../ThemeToggle';

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = React.useContext(UserContext);
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <div className="flex pt-14">
                <div className="hidden lg:block fixed top-14 left-0 h-[calc(100vh-3.5rem)]">
                    <SideMenu activeMenu={activeMenu} />
                </div>
                <main className="flex-1 lg:ml-64 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                Dashboard
                            </h1>
                            <ThemeToggle />
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
