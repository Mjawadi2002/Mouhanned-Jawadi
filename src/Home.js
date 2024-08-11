import { useState } from 'react';
import cv from './images/cv.pdf';
import profileimage from './images/profileimage.png';

export default function Home() {
    const [showAbout, setShowAbout] = useState(false);

    const handleNameClick = () => {
        setShowAbout(!showAbout);
    };

    return (
        <div className="home-container">
            <h1 className="name" onClick={handleNameClick}>Welcome to my portfolio</h1>
            {showAbout && (
                <div className="about-section">
                    <img src={profileimage} alt="Mouhanend Jawadi" className="profile-image" />
                    <p>
                        Hello! I’m Mouhanend Jawadi, currently a computer engineering student at ENSIT in my final year.
                        This portfolio showcases a gallery of my photoshoots and my IT projects during my academic path.
                    </p>
                    <a href={cv} download className="cv-download">Download My CV</a>
                </div>
            )}
        </div>
    );
}
