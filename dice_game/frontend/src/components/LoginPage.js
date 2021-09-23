import React from "react";
import UserDetailsPage from "./UserDetailsPage";

export default function RegisterPage(props) {
    return (
        <UserDetailsPage
            mode={"login"}
            title={"Login"}
            buttonText={"Login"}
            username={""}
            password={""}
        />
    );
}
