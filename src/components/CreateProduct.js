import React, {useState} from 'react';
import CreationTable from "./CreationTable";
import {useScrollLock} from "@vkontakte/vkui";
import '../creationTable.css'
import DragDropField from "./DragDropField";

const CreationProduct = () => {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState(true);
    useScrollLock(open);
    const handleChange = () => {
        setOpen(!open)
    }

    const renderContent = () => {
        switch (activeTab) {
            case true:
                return <CreationTable isOpen={open} onClose={handleChange}/>;
            case false:
                return <DragDropField onClose={handleChange}/>;
            default:
                return null;
        }
    };


    return (
        <div>
            <button onClick={handleChange} className="create-product-button">Добавить продукт</button>
            {open ?
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="button-container">
                            <button className="close-button" onClick={handleChange}>&times;</button>
                        </div>
                        <div style={{display: 'flex', marginBottom: '10px'}}>
                            <button
                                style={{
                                    flex: 1,
                                    marginRight: '5px',
                                    backgroundColor: activeTab === true ? '#007bff' : '#ccc',
                                    color: activeTab === false ? '#fff' : '#000',
                                    border: 'none',
                                    padding: '10px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setActiveTab(!activeTab)}
                            >
                                Создать
                            </button>
                            <button
                                style={{
                                    flex: 1,
                                    backgroundColor: activeTab === false ? '#007bff' : '#ccc',
                                    color: activeTab === false ? '#fff' : '#000',
                                    border: 'none',
                                    padding: '10px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setActiveTab(!activeTab)}
                            >
                                Загрузить
                            </button>
                        </div>
                        <div>
                            {renderContent()}
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
};

export default CreationProduct;