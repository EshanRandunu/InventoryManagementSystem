//rfce -for auto generated code snippet
import React, { useState } from "react";
import axios from "axios";

function Register() {
    const [user, setUser] = useState({
        userName: "",
        email: "",
        password: "",
        phone: ""
    });

    const  {name, email, password, phone} = user;

    const onInputChange = (e) =>{
        setUser({...user, [e.target.name]: e.target.value});
    } 

    const onSubmit = async (e) =>{
        e.preventDefault();
        await axios.post("http://localhost:8080/user", user);
        alert("Registration Successful");
        window.location.reload();
    }

  return (
    <div>
        <p className="auth_topic">Register user Page</p>

            <div className="forme_vontiner">
                <div className="form_sub_coon">

                    <form onSubmit={onSubmit}>

                        <input
                            type="text"
                            name="userName"
                            placeholder="user Name"
                            value={user.userName}
                            onChange={onInputChange}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={onInputChange}
                        />

                        <input
                            type="text"
                            name="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={onInputChange }
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="phone no"
                            value={user.phone}
                            onChange={onInputChange }
                            
                        />
                        <button type="submit">Register</button>

                    </form>

                </div>
            </div>
      
    </div>
  )
}

export default Register
