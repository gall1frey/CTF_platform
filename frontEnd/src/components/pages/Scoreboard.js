import React from 'react';
import Header from "../layout/Header";
import Axios from "axios";
import { Link } from 'react-router-dom';
import {socket} from "../../service/socket";


class Scoreboard extends React.Component {

    state = {
        users: []
    };

    componentDidMount() {
        this.getUsers();
        socket.on('server-update', this.getUsers.bind(this));
        return () => {
            //socket.off();
        }
    }

    async getUsers() {
        let token = localStorage.getItem("auth-token");
        const res = await Axios.get("http://localhost:5000/users/ranks",
            { headers: { "x-auth-token": token } });
        this.setState({ users: res.data });
        console.log("SERVER UPDATE");
    }

    renderList() {
        return this.state.users.map(user => {
            return <tr key={user._id}><td></td><td><Link to={`/user/?${user.displayName}`}>{user.displayName}</Link></td><td>{user.points}</td></tr>;
        })
    }

    render() {

        return (
            <div className="table-page-div">
                <Header />
                <h1>Scoreboard</h1>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody id="Exctab1">
                            {this.renderList()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};

export default Scoreboard;
