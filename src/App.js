import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import React from 'react'
import Home from './components/Home';
import Login from './components/Login';
import { useSelector } from 'react-redux';

function App() {

  const token = useSelector((state) => state.pagination.tokens)

  const existingToken = (localStorage.getItem("accessToken"));

  return (
    <>
      {(token == null || existingToken == null) ? (
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/*' element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/' element={<Navigate to="/home" />} />
          <Route path='/home' exact element={<Home />} >
            <Route path='products' exact element={<Products />} />
            <Route path='dashboard' exact element={<Dashboard />} />
          </Route>
          <Route path='/login' element={<Navigate to="/home" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
