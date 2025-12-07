import React, { useState } from 'react';
import { Header } from '../components/Header';
import './MainLayout.css';

interface MainLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, sidebar }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="main-layout">
            <Header toggleSidebar={toggleSidebar} />
            {/* We need to clone the sidebar element to pass isOpen prop if it's a valid element, 
                or just assume the caller passes isOpen. 
                But MainLayout controls isOpen state. 
                So we should probably pass isOpen to the sidebar function or clone element.
                Or better, expose isOpen control to App? 
                No, let's keep layout control in Layout.
                We can pass isOpen to the sidebar node if we use render prop or cloneElement.
            */}
            {React.isValidElement(sidebar) && React.cloneElement(sidebar as React.ReactElement<any>, { isOpen: isSidebarOpen })}

            <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {children}
            </main>
        </div>
    );
};
