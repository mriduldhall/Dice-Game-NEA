import React from "react";
import UserDetailsPage from "./UserDetailsPage";

export default function RegisterPage(props) {
    return (
        <UserDetailsPage
            mode={"register"}
            title={"Register"}
            buttonText={"Register"}
            username={""}
            password={""}
        />
    );
}
