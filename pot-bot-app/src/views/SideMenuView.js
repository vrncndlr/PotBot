import {Link, useLocation} from 'react-router-dom';
import {useState} from 'react';
import '../styling/SideMenu.css';

function SideMenuView() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (location.pathname === '/' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div className='SideMenu'>
      <button className='hamburger' onClick={toggleMenu}>
        <span className='icon'>&#9776;</span>
      </button>
      {isOpen && (
        <ul>
          <li><Link className="menu-options" to='/about'>About Us</Link></li>
          <li><Link onClick={(e) => e.preventDefault()} className="menu-options" to='/profile'>Profile</Link></li>
        </ul>
      )}
    </div>
  );
}

export default SideMenuView;
