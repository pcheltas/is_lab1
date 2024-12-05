import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

const ImportHistory = () => {
    const [open, setOpen] = useState(false)
    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch();
    const imports = useSelector(state => state.product.imports || [])

    const handleChange = () => {
        setOpen(!open)
    }

    return (
        <div>
            <button onClick={handleChange} className="create-product-button">История импорта</button>
            {open ?
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="button-container">
                            <button className="close-button" onClick={handleChange}>&times;</button>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Статус</th>
                                <th>Пользователь</th>
                                <th>Число добавленных объектов</th>
                            </tr>
                            </thead>
                            <tbody>
                            {imports.length > 0 ? (
                                    imports.map(im => (
                                        <React.Fragment key={im.id}>
                                            <tr className="productTableBody">
                                                <td>{im.id}</td>
                                                <td>{im.status.toString()}</td>
                                                <td>{im.user.login}</td>
                                                <td>{im.count}</td>
                                            </tr>
                                        </React.Fragment>
                                    ))
                                )
                                : <p>Ни один объект не был добавлен из файла</p>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                : null}
        </div>
    );
}

export default ImportHistory;