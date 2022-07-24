import React, { useRef,useContext } from 'react';
import "./register.css";
import axios from "axios";
import {useNavigate,Link} from "react-router-dom"

export default function Register() {
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const username = useRef();

    const navigate = useNavigate();

    var handleClick = async (e)=> {
        e.preventDefault();
        if(passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match");
        }
        else{
            const user={
                username:username.current.value,
                email:email.current.value,
                password:password.current.value,
            }
            try {
                await axios.post("/auth/register",user)
                navigate('/login')
            } catch (err) {
                console.log(err)
            }
        }
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">TeleChat</h3>
                    <span className="loginDesc">
                        Connect with your friends and the world around you on TeleChat.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input type="text" className="loginInput" placeholder="Username" 
                        ref={username}
                        required
                        />
                        <input type="Email" className="loginInput" placeholder="Email"
                        ref={email}
                        required
                        />
                        <input type="password" className="loginInput" placeholder="Password"
                        ref={password}
                        required
                        minLength="6"
                        />
                        <input type="Password" className="loginInput" placeholder="Confirm Password"
                        ref={passwordAgain}
                        required
                        />
                        <button className="loginButton"
                        type="submit"
                        >Sign In</button>
                        <Link to={'/login'} sty>
                        <button className="loginRegisterButton">
                            Log In to your account
                        </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
