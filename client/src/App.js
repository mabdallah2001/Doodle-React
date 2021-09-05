import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import Home from './components/Home/Home';
import DrawingRoom from './components/DrawingPage/DrawingRoom';

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={Home} />
            <Route path="/drawingRoom" component={DrawingRoom}/>
        </Router>
    );
};

export default App;