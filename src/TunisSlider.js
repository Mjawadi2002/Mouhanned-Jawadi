import React from 'react';
import tunis3 from './images/tunis3.jpg';
import tunis2 from './images/tunis2.jpg';
import tunis1 from './images/tunis1.jpg';

export default function TunisSlider() {
    return (
        <div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className="slider-wrapper">
                <div id="carouselExampleFade" className="carousel slide carousel-fade" data-ride="carousel" data-interval="3000">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="d-block w-100" src={tunis3} alt="First slide" />
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={tunis2} alt="Second slide" />
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={tunis1} alt="Third slide" />
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#carouselExampleFade" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExampleFade" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
