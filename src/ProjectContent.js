export default function ProjectContent(props){
    return(
        <div className="container-fluid">
            <div className="card" style={{width:"18rem"}}>
                <img src={props.img} class="card-img-top" alt="..."/>
                <div class="card-body">
                    <h5 className="card-title text-white">{props.title}</h5>
                    <p className="card-text text-white">{props.description}</p>
                    <a href={props.destination} className="btn btn-primary">See More</a>
                </div>
            </div>
        </div>
    );
}