import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Gallery from './Gallery';
import Contact from './Contact';
import Projects from './Projects';
import Video from './Video';
import TunisSlider from './TunisSlider';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Video />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/tunis' element={<TunisSlider />} />
          
       
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
