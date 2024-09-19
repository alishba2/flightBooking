import React from "react";
import "./footer.scss";
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaInstagram,
    FaTwitter,
    FaFacebookF,
    FaTiktok,
    FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
    return (
        <div className="footer-container">
            {/* Contact Info Section */}
            <div className="footer-row">
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <div className="contact-info">
                        <div className="info-item">
                            <FaEnvelope />
                            <p>info@yourdomain.com</p>
                        </div>
                        <div className="info-item">
                            <FaPhone />
                            <p>+123 456 7890</p>
                        </div>
                        <div className="info-item">
                            <FaMapMarkerAlt />
                            <p>123 Main Street, Your City, Your Country</p>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="about">About</a>
                        </li>
                        <li>
                            <a href="notification">Notification</a>
                        </li>

                    </ul>
                </div>

                {/* Social Media Section */}
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="#">
                            <FaInstagram />
                        </a>
                        <a href="#">
                            <FaTwitter />
                        </a>
                        <a href="#">
                            <FaFacebookF />
                        </a>
                        <a href="#">
                            <FaTiktok />
                        </a>
                        <a href="#">
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <div className="footer-bottom">© 2024 Your Company. All rights reserved.</div>
        </div>
    );
}
