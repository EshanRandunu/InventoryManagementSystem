import React from "react";

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={()=>(window.location.href='/additem')}>Add item</button>
      <button onClick={()=>(window.location.href='/allItems')}>View all items</button>

      <button onClick={()=>(window.location.href='/register')}>Register</button>
    </div>
  );
};

export default Home;