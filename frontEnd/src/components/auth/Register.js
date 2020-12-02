import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";

export default function Register() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [displayName, setDisplayName] = useState();
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const newUser = { email, password, passwordCheck, displayName };
            const regRes = await Axios.post("http://localhost:5000/users/register",newUser);
            if(regRes.data.admin === false){
              const loginRes = await Axios.post("http://localhost:5000/users/login", {
                  email,
                  password,
              });
              setUserData({
                  token: loginRes.data.token,
                  user: loginRes.data.user,
                  admin: loginRes.data.admin
              });
              localStorage.setItem("auth-token", loginRes.data.token);
              history.push("/");
            } else {
              history.push("/login");
            }
            window.location.reload(false);
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div id="login_div" className="login">
            <h2>Sign Up</h2>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)}/>}
            <form className="submit_form" onSubmit={submit}>
                <input type="email" name="u" placeholder="Email" required="required" id="register_email" onChange={e => setEmail(e.target.value)} />
                <input type="password" name="p" placeholder="Password" required="required" id="register-password" onChange={e => setPassword(e.target.value)}/>
                <input type="password" name="p" placeholder="Verify Password" required="required" id="password_entered_check" onChange={e => setPasswordCheck(e.target.value)}/>
                <input type="text" name="u" placeholder="Display name" required="required" id="register-display-name" onChange={e => setDisplayName(e.target.value)}/>
                <input type="submit" value="SIGNUP" className="butn butn-primary butn-block butn-large" />
                <p><Link to='/login'>Login instead?</Link></p>
            </form>
        </div>
    );
}
