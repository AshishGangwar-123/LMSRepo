import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineBell, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import './Navbar.css';

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/speaking': 'Speaking Exercise',
    '/interview': 'AI Mock Interview',
    '/resume': 'Resume Analyzer',
    '/report': 'Employability Report',
};

function Navbar() {
    const location = useLocation();
    const { user } = useAuth();
    const title = pageTitles[location.pathname] || 'DemoNLM AI';

    return (
        <header className="navbar">
            <div className="navbar-left">
                <h1 className="navbar-title">{title}</h1>
            </div>
            <div className="navbar-right">
                <div className="navbar-search">
                    <HiOutlineMagnifyingGlass size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search modules..."
                        className="navbar-search-input"
                    />
                </div>
                <button className="navbar-icon-btn" title="Notifications">
                    <HiOutlineBell size={20} />
                    <span className="notification-dot"></span>
                </button>
                <div className="navbar-avatar">
                    {user?.name?.charAt(0) || 'R'}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
