import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <hr />
            <div className="footer-detail">
                <p className="footer-detail-info">Developed by
                    <a href="" rel="noopener noreferrer"><span> Team ML 22 </span></a>
                     . Copyright © 2025 All rights reserved.</p>
            </div>
            <div className="footer-bottom">
                <div className="footer-bottom-connect">
                    <div className="footer-bottom-ts">
                        <a className="footer-cta" href="/Intelligent-Traffic-System-Frontend/">Terms of Service</a>
                    </div>
                    <div className="footer-bottom-pp">
                        <a className="footer-cta" href="/Intelligent-Traffic-System-Frontend/">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;