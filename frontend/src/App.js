import React from 'react';

import './App.css';
import Router from './routes';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Router />
      <Footer />
    </div>
  );
}

export default App;
