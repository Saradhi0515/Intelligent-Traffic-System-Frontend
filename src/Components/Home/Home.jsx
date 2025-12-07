import React from "react";
import './Home.css';
import trafficImage from '../../assets/traffic_image.png';

const Home = () => {
    return (
        <div className="Home">
            <img className="home-image" src={trafficImage} alt="Traffic Illustration" />
            <h1 className="home-title">Intelligent Traffic System for Urban Conditions</h1>
            <h3 className="home-subtitle"><em>- Leveraging Real-Time Vehicle Tracking</em></h3>
            <p className="home-description">
                Welcome to the central control panel for our Intelligent Traffic System. This platform leverages AI and video analytics to address urban traffic challenges, including jams and safety issues. Our system features real-time vehicle tracking, adaptive signal control, accident detection, and emergency vehicle prioritization to enhance traffic flow and safety. Explore the various modules through the navigation bar to learn more about each feature and how they contribute to smarter urban mobility.
            </p>
        </div>
    );
}

export default Home;