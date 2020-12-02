import React, { useState } from 'react';
import Axios from 'axios';
import ErrorNotice from "../misc/ErrorNotice";

export default function AddFlag() {
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [link, setLink] = useState();
    const [points, setPoints] = useState();
    const [flag, setFlag] = useState();
    const [error, setError] = useState();

    const submit = async (e) => {
        e.preventDefault();
        e.target.reset();
        try {
            let token = localStorage.getItem("auth-token");
            const data = {
                title, content, link, points, flag
            };
            const res = await Axios.post("http://localhost:5000/admin/add_chall", data, {
                headers: { "x-auth-token": token }
            });
            setTitle(""); setContent(""); setLink(""); setPoints(""); setFlag("");
            alert("id: "+res.data.id);
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <>
            <div id="login_div" className="login">
                <h2>Add Challenge Here</h2>
                {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                <form className="submit_form" onSubmit={submit}>
                    <div>
                        <input type="text" placeholder="Chall_Title" onChange={e => setTitle(e.target.value)} />
                        <textarea placeholder="Chall_Content" onChange={e => setContent(e.target.value)} />
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
