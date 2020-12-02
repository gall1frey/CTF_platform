import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header >
            
            <h1><Link to="/"> <i className="material-icons">flag</i>  CTF </Link></h1>
            
        </header>
    );
}