import React, { Component } from 'react';

import AuthContext from '../context/auth-context';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import './Auth.css';

class AuthPage extends Component {
    state = {
        isLogin: true,
        isFail: false,
        signupSuccess: false
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    modalConfirmHandler = () => {
        this.setState({isFail: false, signupSuccess: false});
        if(this.state.signupSuccess) {
            this.setState({isLogin: true});
        }

        if(this.emailEl.current) {
            this.emailEl.current.value = '';
        }
        if(this.passwordEl.current) {
            this.passwordEl.current.value = '';
        }        
    }

    switchModeHandelr = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        })
    }

    submitHandler = (event) => {
        event.preventDefault();

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password:$password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        if(!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!) {
                        createUser(userInput: {email: $email, password: $password}) {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }
    
        fetch('http://localhost:8000/api', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(this.state.isLogin && resData.data.login.token) {
                this.context.login(
                    resData.data.login.token, 
                    resData.data.login.userId, 
                    resData.data.login.tokenExpiration
                );
            }
            else if(!this.state.isLogin && resData.data.createUser.email) {
                this.setState({signupSuccess: true});
            }
        })
        .catch(err => {
            this.setState({isFail: true, signupSuccess: false});
        });
    };

    render() {
        return (
            <React.Fragment>
                {(this.state.isFail || this.state.signupSuccess) && <Backdrop />}
                {this.state.isFail && this.state.isLogin && <Modal 
                    title='Login Fail' 
                    canConfirm
                    confirmText='Confirm'
                    onConfirm={this.modalConfirmHandler}
                >
                    <p>You entered wrong E-Mail or Password!</p>
                </Modal>}

                {this.state.isFail && !this.state.isLogin && <Modal 
                    title='Signup Fail' 
                    canConfirm
                    confirmText='Confirm'
                    onConfirm={this.modalConfirmHandler}
                >
                    <p>The E-Mail is already exist!</p>
                </Modal>}

                {this.state.signupSuccess && <Modal 
                    title='Signup Success' 
                    canConfirm
                    confirmText='Confirm'
                    onConfirm={this.modalConfirmHandler}
                >
                    <p>You can login now!</p>
                </Modal>}

                {!this.state.isFail &&
                <form className="auth-form" onSubmit={this.submitHandler}>
                    <div className="form-control">
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" id="email" ref={this.emailEl} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" ref={this.passwordEl} />
                    </div>
                    <div className="form-actions">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={this.switchModeHandelr}>
                            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
                        </button>
                    </div>            
                </form>}
            </React.Fragment>
        );
    }
}

export default AuthPage;