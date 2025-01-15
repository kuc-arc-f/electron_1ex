

import React from "react";
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './client/home';
import About from './client/about';

export default function App(){
  return(
  <div className="App">
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        About
      </Routes>
    </HashRouter>
  </div>
  )
}
/*
*/
/*
import React from "react";

const App = () => {
    return <h1>Hello, Electron with React!</h1>;
};
export default App;

*/