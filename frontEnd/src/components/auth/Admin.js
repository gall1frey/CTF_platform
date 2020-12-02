import React, { useState } from 'react';
import Header from "../layout/Header";
import AddFlag from "../layout/add_flag";
import AddAdmin from "../layout/add_admin";
import RemoveAdmin from "../layout/remove_admin";
import ChangeChall from "../layout/change_chall";
import DeleteChall from "../layout/DeleteChall";
//import { Link } from 'react-router-dom';

export default function Admin() {
  const [clicked, setClicked] = useState("add_chall");
  //setClicked('add_chall');

  return (
        <>
            <Header />
            {
              {
                'add_admin': <AddAdmin />,
                'remove_admin': <RemoveAdmin />,
                'add_chall': <AddFlag />,
                'change_chall': <ChangeChall />,
                'remove_chall': <DeleteChall />,
              }[clicked]
            }
            <div className="footer">
              <nav>
                <button onClick={() => setClicked("add_admin")}>Add Admin</button>
                <button onClick={() => setClicked("change_chall")}>Change Chall</button>
                <button onClick={() => setClicked("add_chall")}>Add Chall</button>
                <button onClick={() => setClicked("remove_admin")}>Remove Admin</button>
                <button onClick={() => setClicked("remove_chall")}>Remove Chall</button>
              </nav>
            </div>
        </>
    );
}
