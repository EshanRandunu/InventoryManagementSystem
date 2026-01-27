import React from 'react';
import{Route,Routes} from 'react-router-dom';
import Home from './components/home/Home';
import AddItem from './components/addItem/AddItem';
import DisplayItem from './components/displayItem/DisplayItem';
import UpdateItem from './components/updateItem/UpdateItem';
import Register from './components/register/Register';

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
        </Routes>
      </React.Fragment>
       
    </div>
  );
}

export default App;
