import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src="/verto-logo.png" alt="Verto" className="h-8 w-auto" />
      </Link>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/post">Post Item</Link>
      </div>
    </nav>
  );
};

export default Navbar;
