import ProjectContent from "./ProjectContent";
import devweb from './images/web.jpeg'
import mobile from './images/mobile.jpeg'
import erp from './images/erp.jpeg'
export default function Projects(){
    return(
        <div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className="container-fluid">
                <div className="row">
                    <div className="col md-4">
                        <ProjectContent 
                            img={erp}
                            title="Erp application"
                            description="this application is a desktop erp application for coffe shops to manage their stock and the rmployers within"
                        />
                    </div>
                    <div className="col md-4">
                        <ProjectContent 
                            img={mobile}
                            title="Mobile application"
                            description="this a mobile application with ionic framework , an ecommerce-app for buying and selling manga"
                            
                        />
                    </div>
                    <div className="col md-4">
                    <ProjectContent 
                            img={devweb}
                            title="Movie Matcher"
                            description="this is a web application using sentiment analysis to analyze and generate movie recommendation"
                          
                        />
                    </div>
                </div>
               
                
            </div>
        </div>
   
    );
}