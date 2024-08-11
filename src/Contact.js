export default function Contact() {
    return (
        <div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className="container-fluid  contact">
            <h1 className="text-white mb-4">Contact Me</h1>
            <form>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label text-white">Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Enter your name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="number" className="form-label text-white">Phone Number</label>
                    <input type="number" className="form-control" id="number" placeholder="Enter your phone number" />
                </div>
                <div className="mb-3">
                    <label htmlFor="message" className="form-label text-white">Message</label>
                    <textarea className="form-control" id="message" rows="4" placeholder="Type your message"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
        </div>
        </div>

    );
}
