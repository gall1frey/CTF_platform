import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Admin from "./components/auth/Admin";
import notFound from "./components/pages/404";
import Scoreboard from "./components/pages/Scoreboard";
import User from "./components/pages/User";
import UserContext from "./context/UserContext";
import {socket} from "./service/socket";
import { useBeforeunload } from 'react-beforeunload';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await Axios.post(
                "http://localhost:5000/users/tokenIsValid",
                null,
                { headers: { "x-auth-token": token } }
            );
            if (tokenRes.data) {
                const userRes = await Axios.get("http://localhost:5000/users/",{
                    headers: { "x-auth-token": token },
                });
                setUserData({
                    token,
                    user: userRes.data.user,
                    admin: userRes.data.admin
                });
            }
        };
        checkLoggedIn();
    }, []);
    useBeforeunload(() => {return () => {socket.off()}});
    return ( <>
        <BrowserRouter>
            <UserContext.Provider value={{ userData, setUserData }}>
            <>
                {userData.user ? (
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        {userData.admin ? (
                          <Route path="/admin" component={Admin} />
                        ) : (
                          <Route path="/admin" component={notFound} />
                        )}
                        <Route path="/register" component={Register} />
                        <Route path="/scoreboard" component={Scoreboard} />
                        <Route path="/user" component={User} />
                        <Route path="/" component={notFound} />
                    </Switch>
                ) : (
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/login" component={Login} />
                        <Route path="/Scoreboard" component={notFound} />
                        <Route path="/" component={notFound} />
                    </Switch>
                )}

            </>
            </UserContext.Provider>
        </BrowserRouter>
    </>
    );
}
