import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from "../../context/UserContext";
import {socket} from "../../service/socket";
import Axios from "axios";
import { Link } from 'react-router-dom';

//rewrite this thing as a class. Big job.


export default function AuthOptions(props) {
    const { userData, setUserData } = useContext(UserContext);
    const [ rank, setRank ] = useState();
    var { displayName, points } = userData.user;
    const history = useHistory();
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined,
            admin: false
        });
        localStorage.setItem("auth-token", "");
        history.push("/login");
        //console.log(userData.user.data);
    };
    const Scoreboard = () => { history.push("/scoreboard"); };
    const Admin = () => {history.push("/admin");};

    const getRank = async () => {
        let token = localStorage.getItem("auth-token");
        const res = await Axios.get("http://localhost:5000/users/rank",
            { headers: { "x-auth-token": token } });
        userData.points = res.data.points;
        setRank(res.data.rank);
    }

    useEffect(() => {
        socket.on('server-update', getRank());
    });
    return (
        <>
            {userData.user ? (
                <>
                    <p><sub>Rank:</sub></p>
                    <h1 id="rank">{rank}</h1>
                    <button><Link to={`/user/?${displayName}`}>{displayName}</Link></button>
                    <h2 id="points">{points}</h2>
                    {userData.admin?(<button onClick={Admin}>Admin Stuff</button>):(<></>)}
                    <button onClick={Scoreboard}>Scoreboard</button>
                    <button id="solved-butn" onClick={props.toggle_solved}>View All</button>
                    <button onClick={logout}>Logout</button>
                    <p><a href="https://github.com/gall1frey/" target="_blank" rel="noopener noreferrer">Credits</a></p>
                </>
            ) : (
                    <></>
                )}
        </>
    );
}
