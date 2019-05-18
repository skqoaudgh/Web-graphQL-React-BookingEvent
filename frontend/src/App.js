import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null,
    email: null
  }

  login = (token, userId, email, tokenExpiration) => {
    this.setState({token: token, userId: userId, email: email});
  };
  
  logout = () => {
    this.setState({token: null, userId: null, email: null});
  };

  componentWillMount() {
    const savedToken = localStorage.savedToken;
    const savedUserId = localStorage.savedUserId;
    const savedEmail = localStorage.savedEmail;
    if(savedToken !== 'null' && savedUserId !== 'null' && savedEmail !== 'null') {
      this.setState({token: savedToken, userId: savedUserId, email: savedEmail});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.token !== this.state.token && prevState.userId !== this.state.userId && prevState.email !== this.state.email) {
      localStorage.savedToken = this.state.token;
      localStorage.savedUserId = this.state.userId;
      localStorage.savedEmail = this.state.email;
    }
  }

  render() {
    return (
      <BrowserRouter>
      <AuthContext.Provider
          value={{
            token: this.state.token, 
            userId: this.state.userId, 
            login: this.login,
            logout: this.logout,
            email: this.state.email
          }}>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {this.state.token && <Redirect path="/" to="/events" exact/>}
              {this.state.token && <Redirect path="/auth" to="/events" exact/>}
              {!this.state.token && <Route path="/auth" component={AuthPage}/>}
              <Route path="/events" component={EventsPage}/>
              {this.state.token && <Route path="/bookings" component={BookingsPage}/>}
              {!this.state.token && <Redirect to="/auth" exact/>}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;