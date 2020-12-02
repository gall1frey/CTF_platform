import React from 'react';
import Header from "../layout/Header";

export default function notFound() {
    return (
        <>
            <Header />
            <div className="center">
                <h2>404</h2>
                <h1>Page Not Found</h1>
                <p>The specified file was not found on this website. Please check the URL for mistakes and try again.</p>
                <h3>Why am I seeing this?</h3>
                <p>Cause you tried to snoop around where you're not supposed to. Go somewhere else, or check out my <a href="https://github.com/gall1frey" rel="noopener noreferrer" target="_blank">github</a>.</p>
            </div>
        </>
    );
}