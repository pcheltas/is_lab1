import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addProductFile} from "../redux/productSlice";

const DragDropField = ({onClose}) => {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile.name.endsWith('.yaml') || droppedFile.name.endsWith('.yml')) {
            setFile(droppedFile);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const removeFile = () => {
        setFile(null);
    };

    const handleSubmit = () => {
        onClose();
        dispatch(addProductFile([file, token]))
    }

    return (
        <div>
            {file ? (
                <div
                    style={{
                        alignContent: "center",
                        textAlign: 'center'
                    }}>
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        style={{
                            alignContent: "center",
                            border: '2px dashed #007bff',
                            borderRadius: '5px',
                            padding: '20px',
                            textAlign: 'center',
                            marginBottom: '10px',
                            cursor: 'pointer',
                            width: '861.82px', // Фиксированная ширина
                            height: '400px', // Фиксированная высота
                            boxSizing: 'border-box', // Учитывать границы в общем размере
                        }}
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        <p style={{fontSize: '20px', fontWeight: 'bold', color: '#0f5dcc'}}>{file.name}</p>
                    </div>
                    <button onClick={removeFile} className="apply-button">Удалить файл</button>
                    <button onClick={handleSubmit} className="create-product-button">Добавить продукты</button>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{
                        alignContent: "center",
                        border: '2px dashed #007bff',
                        borderRadius: '5px',
                        padding: '20px',
                        textAlign: 'center',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        width: '861.82px', // Фиксированная ширина
                        height: '400px', // Фиксированная высота
                        boxSizing: 'border-box', // Учитывать границы в общем размере
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <p style={{fontSize: '20px', fontWeight: 'bold', color: '#0f5dcc'}}>Перетащите файл сюда или
                        кликните для выбора файла (yaml)</p>
                </div>
            )}
            <input
                type="file"
                id="file-input"
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default DragDropField;