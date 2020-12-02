import React from 'react';
import Header from "../layout/Header";
import Axios from "axios";
import queryString from 'query-string';

class User extends React.Component {

    state = {
        challs: [],
        User: ''
    };

    componentDidMount() {
        var a = queryString.parse(this.props.location.search);
        this.getChallsSolved(Object.keys(a)[0]);
    }

    async getChallsSolved(userName) {
        let token = localStorage.getItem("auth-token");
        const res = await Axios.post("http://localhost:5000/users/user",
            {"user":userName},
            { headers: { "x-auth-token": token } });
        //console.log(res.data);
        this.setState({ challs: res.data.challs, User:res.data.user });
    }

    renderList() {
        return this.state.challs.map(chall => {
            return <tr key={chall._id}><td></td><td>{chall.title}</td><td>{chall.points}</td></tr>;
        })
    }

    render() {

        return (
            <div className="table-page-div">
                <Header />
                <h1>{this.state.User}</h1>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Challenge</th>
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

export default User;
