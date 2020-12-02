import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const { setUserData } = useContext(UserContext);
    const history = useHistory();
    const [error, setError] = useState();
    const [admin, setAdmin] = useState();
    const [secretStr, setSecretStr] = useState();

    const checkAdmin = async(e) => {
      const adminRes = await Axios.post("http://localhost:5000/users/is_admin", {email:email});
      setAdmin(adminRes.data.msg);
    }

    const submit = async (e) => {
        e.preventDefault();
        try {
            const loginUser = { email, password };
            //console.log(adminRes);
            if(admin === "true"){
              const loginAdmin = {email,password,secretStr};
              const loginRes = await Axios.post("http://localhost:5000/users/login", loginAdmin);
              setUserData({
                  token: loginRes.data.token,
                  user: loginRes.data.user,
                  admin: loginRes.data.admin,
              });
              localStorage.setItem("auth-token", loginRes.data.token);
            } else {
              const loginRes = await Axios.post("http://localhost:5000/users/login", loginUser);
              setUserData({
                  token: loginRes.data.token,
                  user: loginRes.data.user,
                  admin: loginRes.data.admin,
              });
              localStorage.setItem("auth-token", loginRes.data.token);
            }
            if(admin === "true") history.push("/admin");
            else history.push("/");
            //window.location.reload(false);
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div id="login_div" className="login">
            <h2>Login</h2>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            <form className="submit_form" onSubmit={submit}>
                <input type="email" name="u" placeholder="Email" required="required" id="login-email" onChange={e => setEmail(e.target.value)} onBlur={e => checkAdmin(e.target.value)}/>
                <input type="password" name="p" placeholder="Password" required="required" id="password_entered_login" onChange={e => setPassword(e.target.value)} />
                {admin === "true" ? (<input type="text" name="s" placeholder="Secret" id="login-secret" onChange={e => setSecretStr(e.target.value)}/>):(<></>)}
                <input type="submit" className="butn butn-primary butn-block butn-large" value="LOGIN"/>
                <p><Link to='/register'>Don't have an account?</Link></p>
            </form>
        </div>
    );
}
