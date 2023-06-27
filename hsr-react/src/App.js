import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home/Home';
import Relic from './pages/Relic/Relic';
import Build from './pages/Build/Build';
import NavBar from './pages/NavBar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path='/' Component={Home} />
        <Route exact path='/relic' Component={Relic} />
        <Route exact path='/build' Component={Build} />
      </Routes>
    </Router>
  );
}

export default App;
