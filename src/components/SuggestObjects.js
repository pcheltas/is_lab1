import React from 'react';
import '../scrollableSuggestion.css';

const SuggestObject = ({ mass, name, handleChoice, amountOfLabels, labelKey} ) => {

    return (
        <div className="scrollable-suggestion" style={{}}>
            {mass.map((item, index) => (
                <button
                    key={index}
                    className="rectangle-button"
                    onClick={() => handleChoice(item, name)}
                >
                    {(amountOfLabels === 1)
                        ? item[labelKey]
                        : (item[labelKey[0]] + ' ' + item[labelKey[1]])}
                </button>
            ))}
        </div>
    );
};

export default SuggestObject;