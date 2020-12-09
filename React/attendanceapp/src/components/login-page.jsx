import React, {useState, useEffect} from 'react';

const LoginPage = ({isManager}) => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    useEffect(() => {
        document.querySelector('.btn.btn-primary').disabled = !(name !== '' && password !== '');
    }, [name, password])
    let handleName = event => setName(event.target.value)
    let handlePassword = event => setPassword(event.target.value)
    return (
        <div className="loginUser">
            {isManager ?
                <h1>Welcome Manager</h1>
                :
                <h1>Welcome Worker</h1>
            }
            <br/><p>Please Login.</p>
            {isManager ?
                <div>
                    <input type="text" placeholder='Enter department name' onChange={handleName}/><br/><br/>
                    <input type="password" placeholder='Password' onChange={handlePassword}/><br/><br/>
                    <button className='btn btn-primary'
                            onClick={() => window.location.href = '/manager/' + name}>Login
                    </button>
                </div>
                :
                <div>
                    <input type="text" placeholder='Username' onChange={handleName}/><br/><br/>
                    <input type="password" placeholder='Password' onChange={handlePassword}/><br/><br/>
                    <button className='btn btn-primary'
                            onClick={() => window.location.href = '/worker/' + name}>Login
                    </button>
                </div>
            }
        </div>
    );
};

export default LoginPage;
