import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

function Layout({ children }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-area">
                <Navbar />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
