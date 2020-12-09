import React from 'react';
import {Link} from "react-router-dom";

const Login = ({handleManager}) => {
    document.getElementById("ourLogo").style.display="block"
    return (
        <div className="login">
            <h1>Welcome!</h1><br/>
            <p>Please login to your account.</p>
            <Link to='/login'>Manager Login</Link>
            <br/><br/>
            <Link onClick={handleManager} to='/login'>Workers Login</Link>
        </div>
    );
};

export default Login;
