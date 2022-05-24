import React, { useState } from "react";
import axios from "axios";
import fetchData from "../APIActions/FetchData";
import "../TicketSysPlusPages/TSPApp.css";
import NewJsonFetched from "../TicketSysPlusPages/NewJsonFetched";
import { Modal, Button, Collapse } from "react-bootstrap";

const fetchDataPromise = fetchData("ticketInfo");

function AdminJson() {
    const dataDetails = fetchDataPromise.read();
    const json = JSON.stringify(dataDetails, null, 3);
    const [change, setChange] = useState(true);
    const [data, setData] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function verify() {
        const jsonText = document.getElementById("jsonText").value;
        {/*TODO: && if schema is valid*/ }
        if (jsonText !== json) {
            setChange(false);
            setData(jsonText);
        }
        else {
            setChange(true);
        }
    }

    function loadOld() {
        axios
            .get("https://backend.granny.dev/jsons")
            .then((res) => {
                //TODO: setCurrentJson should be the body of the db data from the get
                console.log(res.data);
                document.getElementById("jsonText").value = res.data[0].body;
                verify();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="row align-items-center justify-content-center mt-5">
                <div className="col-7 d-flex mb-1">

                    <button onClick={handleShow} className="btn btn-danger mx-3" id="savebtn" type="button" disabled={change}>Save</button>

                    <button onClick={() => loadOld()} className="btn btn-danger mx-3" id="oldbtn" type="button">Load Old Json Schema</button>
                    <button className="btn btn-danger mx-3" id="importbtn" type="button">Import</button>
                    <button className="btn btn-danger mx-3" id="exportbtn" type="button">Export</button>
                </div>


                <div className="col-7 text-center border border-3 border-info p-3 bg-white shadow-lg">
                    <textarea onChange={() => verify()} style={{ height: "400px" }} name="ticketData" id={"jsonText"} className="text-wrap text-break w-100">
                        {json}
                    </textarea>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} className="row">
                <div className="col-12">
                    <Modal.Dialog className="shadow-lg">

                        <Modal.Header closeButton>
                            <Modal.Title>Save JSON</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <NewJsonFetched  adminDisplay={data}/>
                        </Modal.Body>
                    </Modal.Dialog>
                </div>
            </Modal>
        </>
    );

}

export default AdminJson;
