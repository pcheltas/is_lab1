import React, {useEffect, useState} from 'react';
import {useScrollLock} from "@vkontakte/vkui";
import '../creationTable.css';
import '../administration.css'
import {useDispatch, useSelector} from "react-redux";
import {acceptAdminRequest, declineAdminRequest, fetchPotentialAdmins} from "../redux/adminSlice";

const Administration = () => {
    const dispatch = useDispatch();
    const role = useSelector(state => state.auth.role)
    const token = useSelector(state => state.auth.token)
    const potentialAdmins = useSelector(state => state.admin.potentialAdmins)
    const [open, setOpen] = useState(false)
    useScrollLock(open);
    const handleChange = async () => {
        if (!open) {
            await dispatch(fetchPotentialAdmins(token))
        }
        setOpen(!open)
    }

    const handleAccept = async (id) => {
        console.log("accept")
        await dispatch(acceptAdminRequest([id, token]))
        await dispatch(fetchPotentialAdmins(token))
    }
    const handleDecline = async (id) => {
        console.log("decline")
        await dispatch(declineAdminRequest([id, token]))
        await dispatch(fetchPotentialAdmins(token))
    }

    // useEffect( () => {
    //     async function fetchData() {
    //         await dispatch(fetchPotentialAdmins(token))
    //     }
    //     fetchData();
    // }, [dispatch, token]);

    return (
        <div>
            {role === "ADMIN" ? (
                <div>
                    <button onClick={handleChange} className="create-product-button">Админка</button>
                    {open ? <div>
                        <div className="modal-overlay">
                            <div className="modal-content admin-window">
                                <div className="button-container">
                                    <button className="close-button" onClick={handleChange}>&times;</button>
                                </div>
                                <div className="modal-content ">
                                    {potentialAdmins.length === 0 ? (
                                        <span>Нет потенциальных админов</span>
                                    ) : (
                                        potentialAdmins.map((item, index) => (
                                            <div className="modal-row" key={index} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span>{item.login}</span>
                                                <div>
                                                    <button className="close-button-admin" onClick={() => handleDecline(item.id)}>✖</button>
                                                    <button className="confirm-button-admin" onClick={() => handleAccept(item.id)}>✔</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div> : null}
                </div>
            ) : null}
        </div>
    );
};

export default Administration;