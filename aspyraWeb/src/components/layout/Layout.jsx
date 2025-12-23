import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebar } from '../../context/SidebarContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="app-container">
      <Sidebar />
      <div className={`main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;