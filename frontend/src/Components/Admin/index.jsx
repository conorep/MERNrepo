import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import React, {useState} from "react";
import { Col, Row } from "react-bootstrap";

import { loginRequest } from "../../authConfig";
import NavBar from "../NavBar";

import Responders from "./Responders";
import JsonViewer from "./JsonViewer";


function Admin() {
    const authRequest = {
        ...loginRequest
    };

    /*child changes to show trigger tickets rerender. needed for rerender after ticket creation*/
    const [show, setShow] = useState(false);

    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
        >
            <NavBar show={show} setShow={setShow} />
            <Row className={"me-0"}>
                <Col xs={10} id={"inset-shadow"}>
                    <JsonViewer />
                </Col>
                <Col xs={2} id={"sidebar-right"}>
                    <Row className={"m-2 justify-content-center"}>
                        <Responders />
                    </Row>
                </Col>
            </Row>

        </MsalAuthenticationTemplate>
    );
}

export default Admin;
