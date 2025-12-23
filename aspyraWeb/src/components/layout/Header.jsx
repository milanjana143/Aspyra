import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-content">
        {/* Right Side Actions */}
        <div className="header-actions">
          {/* User Profile */}
          <Link to="/profile" className="user-profile">
            <FaUserCircle className="user-avatar" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;