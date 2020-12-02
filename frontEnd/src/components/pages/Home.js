import React from 'react';
import Header from "../layout/Header";
import AuthOptions from "../auth/AuthOptions";
import Cards from "../layout/Cards";

class Home extends React.Component {
    state = {
        viewSolvedBool:1
    };
    toggle_solved() {
        if (document.getElementById("solved-butn").textContent === "View Unsolved") {
            document.getElementById("solved-butn").innerHTML = "View All";
            this.setState({ viewSolvedBool: 1 });
        }
        else if (document.getElementById("solved-butn").textContent === "View All") {
            document.getElementById("solved-butn").innerHTML = "View Unsolved";
            this.setState({ viewSolvedBool: 0 });
        }
        //console.log(this.state.viewSolvedBool);
    };
    render() {
        return (
            <div>
                <Header />
                <div id="content">
                    <div id="user_info">
                        <AuthOptions toggle_solved={this.toggle_solved.bind(this)}/>
                    </div>
                    <div id="data">
                        <div id="chal_content">
                            <Cards query={ this.state.viewSolvedBool ? 1 : 0 } />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}    

export default Home;
//export default function 