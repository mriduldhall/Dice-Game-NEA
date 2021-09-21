import React from "react";
import { render } from "react-dom";


export default function App(props) {
    return (
        <div className="center main-background"/>
    );
}

const appDiv = document.getElementById("app");
render(<App/>, appDiv);
