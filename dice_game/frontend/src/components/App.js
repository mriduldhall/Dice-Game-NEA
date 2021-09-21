import React from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";


export default function App(props) {
    return (
        <div className="center main-background">
            <HomePage/>
        </div>
    );
}

const appDiv = document.getElementById("app");
render(<App/>, appDiv);
