import { useState } from 'react';
import cv from './images/cv.pdf';
import profileimage from './images/profileimage.png';
import linkedinLogo from './images/linkedin.png';
import facebookLogo from './images/facebook.png';
import instagramLogo from './images/instagram.png';


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

                    <a href={cv} download className="cv-download">Download My CV</a>
                    
                    <div className='social-media-section container-fluid mt-3'>
                        <p className='social-media-text'>Connect with me on my social media profiles:</p>
                        <div className='row'>
                            <div className='col-md-4'>
                                <a href="https://www.linkedin.com/mynetwork/grow/" target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinLogo} alt="LinkedIn" className="social-logo" />
                                </a>
                            </div>
                            <div className='col-md-4'>
                                <a href="https://www.facebook.com/profile.php?id=100083750044161" target="_blank" rel="noopener noreferrer">
                                    <img src={facebookLogo} alt="Facebook" className="social-logo" />
                                </a>
                            </div>
                            <div className='col-md-4'>
                                <a href="https://www.instagram.com/mouhanned_jaouedi/?hl=fr" target="_blank" rel="noopener noreferrer">
                                    <img src={instagramLogo} alt="Instagram" className="social-logo" />
                                </a>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="feedback-container d-flex justify-content-center align-items-center">
                                <input type="text" className="feedback-input" placeholder="Give your feedback" />
                                <button className="btn btn-primary " style={{width:"100px"}}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
