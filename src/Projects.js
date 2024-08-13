import ProjectContent from "./ProjectContent";
import devweb from './images/web.jpeg';
import mobile from './images/mobile.jpeg';
import erp from './images/erp.jpeg';

export default function Projects(){
    const projects = [
        {id: 1, img: erp, title: "ERP Application", description: "This application is a desktop ERP application for coffee shops to manage their stock and the employees within.", destination: "https://github.com/Mjawadi2002/ERP-desktop-application"},
        {id: 2, img: mobile, title: "Mobile Application", description: "This is a mobile application built with the Ionic framework, for buying and selling manga.", destination: "https://github.com/Mjawadi2002/Manga-mobile-app"},
        {id: 3, img: devweb, title: "Movie Matcher", description: "This is a web application using sentiment analysis to analyze and generate movie recommendations.", destination: "https://github.com/Mjawadi2002/Mouhanned-Jawadi"},
    ];

    return (
        <div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className="container-fluid">
                <div className="row">
                    {projects.map(project => (
                        <div key={project.id} className="col-md-4">
                            <ProjectContent
                                title={project.title}
                                description={project.description}
                                img={project.img}
                                destination={project.destination}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
