import ProjectContent from "./ProjectContent";
import tunis from './images/tunis.jpg';
import bizerte from './images/bizerte.jpg';
import kef from './images/kef.jpg';
import personel from './images/personel.jpg';


export default function Gallery(){
    const projects = [
        {id: 1, img: tunis, title: "Tunis", description: "This section showcases the images of different places in Tunis", destination: "/tunis"},
        {id: 2, img: bizerte, title: "Bizerte", description: "This section showcases the images of different places in Bizerte", destination: "/bizerte"},
        {id: 3, img: kef, title: "Kef", description: "This section showcases the images of different places in Kef", destination: "/kef"},
        {id: 4, img: personel, title: "Personel", description: "This section showcases the images of different places in my life", destination: "/personel"},
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
                        <div key={project.id} className="col-md-3">
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
