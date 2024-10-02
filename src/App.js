import React from 'react';
import GlobalStyles from './styles/GlobalStyles';
import RouteScreen from './RouteScreen';
import { Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
      <Routes>
        <Route path="/" element={<RouteScreen />}></Route>
      </Routes>
      </div>
    </>
  );
};

export default App;
