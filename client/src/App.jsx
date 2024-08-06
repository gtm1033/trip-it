import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {CreateListing, Home, ListingDetails, CRM, Login} from './pages';

function App() {
  return (
    <div >
      <BrowserRouter>

       <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/create-listing' element={<CreateListing/>} />
            <Route path='/host_login' element={<Login/>} />
            <Route path='/CRM' element={<CRM/>} />
            <Route path="/properties/:listingId" element={<ListingDetails />} />



            
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
