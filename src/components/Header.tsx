import React from 'react';
import { Menu, Search, RefreshCw, Settings, Grid, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import './Header.css';

interface HeaderProps {
    toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <div className="header__left">
                <button className="icon-btn" onClick={toggleSidebar} aria-label="Main menu">
                    <Menu size={24} />
                </button>
                <div className="header__logo">
                    <img src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" alt="Keep" />
                    <span>Keep</span>
                </div>
            </div>

            <div className="header__middle">
                <div className="search-bar">
                    <button className="icon-btn search-icon" aria-label="Search">
                        <Search size={20} />
                    </button>
                    <input type="text" placeholder="Search" />
                </div>
            </div>

            <div className="header__right">
                <div className="header__actions">
                    <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                    </button>
                    <button className="icon-btn" aria-label="Refresh">
                        <RefreshCw size={24} />
                    </button>
                    <button className="icon-btn" aria-label="List view">
                        <Grid size={24} />
                    </button>
                    <button className="icon-btn" aria-label="Settings">
                        <Settings size={24} />
                    </button>
                </div>
                <div className="header__profile">
                    <button className="icon-btn" aria-label="Google Account">
                        <User size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};
