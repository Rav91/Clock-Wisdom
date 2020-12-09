import React from 'react';

const Logout = () => {
    let handleClick = () => window.location.href = 'http://localhost:3000/'
    return (
        <div>
            <input type="button" className='btn btn-secondary btn-sm' onClick={handleClick} value="Logout"/>
        </div>
    );
};

export default Logout;
