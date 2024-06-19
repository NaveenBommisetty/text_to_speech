import React, { useState } from 'react';
import '../header/header.css'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="card">
      <div className="card-body">
        {/* <div className="container">
          <div className="navbar">
            <a className="navbar-brand" href="#home">
              <img
                src="https://www.trulydiscover.com/wp-content/uploads/2022/08/Logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="Logo"
              />
              {' Tools'}
            </a>
            <button className="menu-toggle" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={`navbar-collapse ${isOpen ? 'open' : ''}`}>
              <div className="navbar-nav">
                <a className="nav-item nav-link" href="#features">Features</a>
                <a className="nav-item nav-link" href="#pricing">Pricing</a>
                <a className="nav-item nav-link" href="#customers">Customers</a>
                <a className="nav-item nav-link" href="#blog">Blog</a>
                <a className="nav-item nav-link" href="#help">Help</a>
                <a className="nav-item nav-link btn btn-outline-primary" href="#login">Log in</a>
                <a className="nav-item nav-link btn btn-warning text-white ml-2" href="#signup">Free trial</a>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Header;
