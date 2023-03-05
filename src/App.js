import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Components/Auth';
import Home from './Components/Home';
import Task from './Components/Task';
import ErrorPage from './Components/ErrorPage';
import Profile from './Components/Profile';
import Bin from './Components/Bin';


function App() {
  return (
    <div className="App" style={{backgroundColor: "rgb(22, 32, 51)", color: "white"}}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path="/home/:userId" element={<Home/>} />
          <Route path="/binned-notes/:userId" element={<Bin/>} />
          <Route path="/profile/:userId" element={<Profile/>} />
          <Route path="*" element={<ErrorPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


