import React from 'react';
import Axios from "axios";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
//import { Link } from 'react-router-dom';

class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.getChalls();
        //console.log(this.props.query);
    }

    state = {
        allChalls: [],
        unsolvedChalls: [],
        flag: '',
        challenge: ''
    };

  /*  componentDidMount() {
        
    }*/

    async getChalls() {
        let token = localStorage.getItem("auth-token");
        //if unsolvedFlag equals 1, get all unsolved challs
        const unsolvedRes = await Axios.get("http://localhost:5000/challenges/userChalls",
            { headers: { "x-auth-token": token } });
        this.setState({ unsolvedChalls: unsolvedRes.data });

        const allRes = await Axios.get("http://localhost:5000/challenges/",
            { headers: { "x-auth-token": token } });
        this.setState({ allChalls: allRes.data });
    }

    async submitFlag(f) {
        f.preventDefault();
        const token = localStorage.getItem("auth-token");

        try {
            const Challenge = this.state.challenge;
            const Flag = this.state.flag;
            const challFlag = { "id": Challenge, "flag": Flag };
            const flagVerifyRes = await Axios.post("http://localhost:5000/challenges/validateFlag", challFlag, {
                headers: { "x-auth-token": token }
            });
            var index = this.state.unsolvedChalls.findIndex(this.checkID.bind(this));
            if (index > -1) {
                this.state.unsolvedChalls.splice(index, 1);
            }
            alert(flagVerifyRes.data.msg);
            this.setState(this.state.unsolvedChalls);
        } catch (err) {
            console.log(err.response.data.msg);
            alert(err.response.data.msg);
        }
        //Removing solved chall from unsolved list

    };

    checkID(e) {
        if (e._id === this.state.challenge)
            return true;
    }

    renderList(unsolvedFlag) {
       
        if (unsolvedFlag) {
            return this.state.unsolvedChalls.map(chall => {
                return (
                    <Card key={chall._id}>
                        <Accordion.Toggle as={Card.Header} eventKey={chall._id} >
                            <div className="card-title">
                                <p className="card-title">{chall.title}</p>
                                <p className="card-title">{chall.points}</p>
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={chall._id}>
                            <Card.Body>
                                <p>
                                    {chall.content}
                                    {(chall.link.length > 3) ? 
                                        (<><br/><a href={chall.link} target="_blank" rel="noopener noreferrer">link</a></>)
                                        : (<></>)
                                    }
                                </p>
                                <form id="flag-sub-form" onSubmit={this.submitFlag.bind(this)}>
                                    <input type="text" id="flag-sub-input" placeholder="CTF{}" required="required" onChange={f => this.setState({ flag: f.target.value, challenge: chall._id })} />
                                    <input type="submit" id="flag-sub-butn" className="butn butn-primary butn-block butn-large" value="submit" />
                                </form>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                );
            })
        } else {
            return this.state.allChalls.map(chall => {
                return (
                    <Card key={chall._id}>
                        <Accordion.Toggle as={Card.Header} eventKey={chall._id} >
                            <div className="card-title">
                                <p className="card-title">{chall.title}</p>
                                <p className="card-title">{chall.points}</p>
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={chall._id}>
                            <Card.Body>
                                <p>
                                    {chall.content}
                                    {(chall.link.length > 3) ? 
                                        (<><br/><a href={chall.link} target="_blank" rel="noopener noreferrer">link</a></>)
                                        : (<></>)
                                    }
                                </p>
                                <form id="flag-sub-form" onSubmit={this.submitFlag.bind(this)}>
                                    <input type="text" id="flag-sub-input" placeholder="CTF{}" required="required" onChange={f => this.setState({ flag: f.target.value, challenge: chall._id })} />
                                    <input type="submit" id="flag-sub-butn" className="butn butn-primary butn-block butn-large" value="submit" />
                                </form>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                );
            })
        }
    }

    render() {

        return (
            <Accordion >
                {this.renderList(this.props.query)}
            </Accordion>
        );
    }
};

export default Cards;