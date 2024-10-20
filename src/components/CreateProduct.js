import React, {useState} from 'react';
import CreationTable from "./CreationTable";
import {useScrollLock} from "@vkontakte/vkui";
import '../creationTable.css'

const CreationProduct = () => {
    const [open, setOpen] = useState(false)
    useScrollLock(open);
    const handleChange = () => {
        setOpen(!open)
    }



    return (
        <div>
            <button onClick={handleChange} className="create-product-button">Добавить продукт</button>
            {open ? <CreationTable isOpen={open} onClose={handleChange}/> : null}
        </div>
    );
};

export default CreationProduct;