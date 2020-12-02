import React, { useState } from 'react';
import Axios from 'axios';
import ErrorNotice from "../misc/ErrorNotice";

export default function AddAdmin() {
    const [id, setId] = useState();
    const [error, setError] = useState();

    const submit = async (e) => {
        e.preventDefault();
        e.target.reset();
        try {
            let token = localStorage.getItem("auth-token");
            const res = await Axios.post("http://localhost:5000/users/add_admin", id, {
                headers: { "x-auth-token": token }
            });
            alert(res.data.msg);
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <>
            <div id="login_div" className="login">
                <h2>Who to make admin?</h2>
                {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                <form className="submit_form" onSubmit={submit}>
                    <div>
                        <input type="text" placeholder="Admin_ID" onChange={e => setId(e.target.value)} />
                        <input type="submit" className="butn butn-primary butn-block butn-large" value="submit" />
                    </div>
                </form>
            </div>
        </>
    );
}
