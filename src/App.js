import React, {useState} from 'react';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Categories from './Pages/Categories/Categories';
import Videos from './Pages/Videos/Videos';
import AddCate from './Pages/Categories/AddCategory/AddCate';
import {BrowserRouter, Routes, Route,} from "react-router-dom";
import Edit from './Pages/Categories/Edit/Edit';
import AddVideo from './Pages/Videos/AddVideo/AddVideo';
import EditVideo from './Pages/Videos/Edit/Edit';

function App() {
  
  const [hasAccount, setHasAccount] = useState(false)


  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/dashboard" element={hasAccount? <Categories setHasAccount={setHasAccount} /> :
      <Login setHasAccount={setHasAccount} />} />

      <Route path='/category' element={hasAccount?  <Categories />  :
      <Login setHasAccount={setHasAccount} />} />

      
      <Route path='/category/add-category' element={hasAccount?  <AddCate />  :
      <Login setHasAccount={setHasAccount} />} />

      <Route path='/category/edit/:id' element={hasAccount?  <Edit />  :
      <Login setHasAccount={setHasAccount} />} />

      <Route path='/category/videos/:id' element={hasAccount? <Videos />  :
      <Login setHasAccount={setHasAccount} />} />

      <Route path='/category/video/add-video' element={hasAccount?  <AddVideo />  :
      <Login setHasAccount={setHasAccount} />} />

      <Route path='/category/video/edit/:id/:cateid' element={hasAccount?  <EditVideo />  :
      <Login setHasAccount={setHasAccount} />} />

    </Routes>

      
    </BrowserRouter>
  );
}

export default App;
