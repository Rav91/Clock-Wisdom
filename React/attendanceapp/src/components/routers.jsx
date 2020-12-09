import React, {useState} from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from "./login";
import LoginPage from "./login-page";
import ManagerDashboard from "./manager-dashboard";
import AddWorker from "./add-worker";
import WorkerDashboard from "./worker-dashboard";

const Routers = () => {
    const [isManager, setManager] = useState(true)
    let handleManager = () => setManager(false)
    return (
        <React.Fragment>
            <Switch>
                <Route exact path='/' component={() => <Login handleManager={handleManager}/>}/>
                <Route exact path='/login'
                       component={() => <LoginPage isManager={isManager}/>}/>
                <Route exact path='/add/:name' component={AddWorker}/>
                <Route exact path='/manager/:name' component={ManagerDashboard}/>
                <Route exact path='/worker/:name' component={WorkerDashboard}/>
            </Switch>
        </React.Fragment>
    );
};

export default Routers;
