import React from 'react';
import{Route,Routes} from 'react-router-dom';
import Home from './components/home/Home';
import AddItem from './components/addItem/AddItem';
import DisplayItem from './components/displayItem/DisplayItem';
import UpdateItem from './components/updateItem/UpdateItem';
import Register from './components/register/Register';
import Login from './components/login/Login';
import UserProfile from './components/userProfile/UserProfile';
import UpdateUser from './components/updateUser/UpdateUser';

import DisplayUsers from './components/displayUsers/DisplayUsers';

function App() {
  return (
    <div >
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/additem" element={<AddItem />} />
          <Route path="/allItems" element={<DisplayItem />} />
          <Route path="/updateItem/:id" element={<UpdateItem />} />
          {/*user management */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/updateUser/:id" element={<UpdateUser />} />

          <Route path="/displayUsers" element={<DisplayUsers />} />
          
        </Routes>
      </React.Fragment>
       
    </div>
  );
}

export default App;
