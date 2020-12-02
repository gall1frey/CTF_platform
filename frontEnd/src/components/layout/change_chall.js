import React, { useState } from 'react';
import Axios from 'axios';
import ErrorNotice from "../misc/ErrorNotice";

export default function ChangeChall() {
    const [id, setId] = useState(null);
    const [title, setTitle] = useState(null);
    const [content, setContent] = useState(null);
    const [link, setLink] = useState(null);
    const [points, setPoints] = useState(null);
    const [flag, setFlag] = useState(null);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        e.target.reset();
        try {
            let token = localStorage.getItem("auth-token");
            const data = {
                id, title, content, link, points, flag
            };
            const res = await Axios.post("http://localhost:5000/admin/change_chall", data, {
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
                <h2>Change Stuff Here</h2>
                <p>Enter only that which you want to change</p>
                {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                <form className="submit_form" onSubmit={submit}>
                    <div>
                        <input type="text" placeholder="Chall_Id" onChange={e => setId(e.target.value)} />
                        <input type="text" placeholder="Chall_Title" onChange={e => setTitle(e.target.value)} />
                        <input type="text" placeholder="Chall_Content" onChange={e => setContent(e.target.value)} />
                        <input type="text" placeholder="Chall_Points" onChange={e => setPoints(e.target.value)} />
                        <input type="text" placeholder="Chall_Link" onChange={e => setLink(e.target.value)} />
                        <input type="text" placeholder="Chall_Flag" onChange={e => setFlag(e.target.value)} />
                        <input type="submit" className="butn butn-primary butn-block butn-large" value="submit" />
                    </div>
                </form>
            </div>
        </>
    );
}
