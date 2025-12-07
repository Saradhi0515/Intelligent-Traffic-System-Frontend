import React from "react";
import './Navbar.css';
import logo from '../../assets/profile_logo.png';
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <img className="img" src={logo} alt="Logo" />
            <ul className="nav-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/anpr-atcc">ANPR & ATCC</Link></li>
                <li><Link to="/accident">Accident Detection</Link></li>
                <li><Link to="/signal">Signal Control</Link></li>
                <li><Link to="/emergency">Emergence Vehicle</Link></li>
            </ul>
            <div className="nav-about-us">
                <Link to="/about">About Us</Link>
            </div>
        </div>
    );
}

export default Navbar;