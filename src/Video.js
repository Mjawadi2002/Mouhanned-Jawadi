import video from './images/dark.mp4'

export default function Video(){
    return(
        <div className="video-background">
            <video autoPlay muted loop>
                <source src={video} type="video/mp4" />
            </video>
        </div>
    );
}