import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
    HiOutlineHome,
    HiOutlineMicrophone,
    HiOutlineChatBubbleLeftRight,
    HiOutlineDocumentText,
    HiOutlineChartBarSquare,
    HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';
import { RiRobot2Line } from 'react-icons/ri';
import './Sidebar.css';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
    { path: '/speaking', label: 'Speaking Exercise', icon: HiOutlineMicrophone },
    { path: '/interview', label: 'Mock Interview', icon: HiOutlineChatBubbleLeftRight },
    { path: '/resume', label: 'Resume Analyzer', icon: HiOutlineDocumentText },
    { path: '/report', label: 'Employability Report', icon: HiOutlineChartBarSquare },
];

function Sidebar() {
    const { user, logout } = useAuth();

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <RiRobot2Line size={24} />
                </div>
                <div className="sidebar-brand-text">
                    <span className="brand-name">DemoNLM</span>
                    <span className="brand-tag">AI</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                <div className="nav-label">MAIN MENU</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} className="sidebar-link-icon" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User section */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {user?.name?.charAt(0) || 'R'}
                    </div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{user?.name || 'Student'}</span>
                        <span className="sidebar-user-year">{user?.year || '3rd Year'}</span>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={logout} title="Logout">
                    <HiOutlineArrowRightOnRectangle size={18} />
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
