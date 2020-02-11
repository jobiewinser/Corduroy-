import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Forgot from './components/Forgot';
import Register from './components/Register';
import PlaySounds from './components/PlaySounds';
import { Route, BrowserRouter as Router, Switch} from 'react-router-dom';

const routing = (
    <Router>
        <div>
            <Switch>
                <Route exact path='/' component={ App } />
                <Route path='/dashboard' component={ Dashboard } />
                <Route path='/login' component={ Login} />
                <Route path='/register' component={ Register } />
                <Route path='/forgot' component={ Forgot } />
                <Route path='/logout' component={ Login } />
                <Route path='/sounds' component={ PlaySounds } />            </Switch>
        </div>
    </Router>
)


ReactDOM.render(routing, document.getElementById('root'));
