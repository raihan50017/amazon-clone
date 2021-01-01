import { Link, useHistory } from 'react-router-dom';
import React from 'react';
import './Login.css';
import { useState } from 'react';
import { auth } from './firebase';

const Login = () => {

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                history.push('/');
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    const register = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                console.log(user);
                if (user) {
                    history.push('/');
                }
            })
            .catch((error) => {
                alert(error.message);
            });
    }


    return (
        <div className="login">
            <Link to="/">
                <img className="login__logo" src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt=""></img>
            </Link>
            <div className="login__container">
                <h1>Sign-in</h1>
                <form>
                    <h5>E-mail</h5>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="text" name="" id="" />
                    <h5>Password</h5>
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="" id="" />
                    <button type='submit' onClick={signIn} className="login__signInButton">Sign In</button>
                </form>
                <p>
                    By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & Sale. Please
                    see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
                </p>
                <button onClick={register} className="login__registerButton">Create your Amazon Account</button>
            </div>
        </div>
    );
};

export default Login;