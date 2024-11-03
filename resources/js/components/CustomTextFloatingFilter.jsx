// resources/js/Components/CustomTextFloatingFilter.jsx
import React from 'react';

const CustomTextFloatingFilter = (props) => {
    const { filterText, onChange, filterType } = props;

    return (
        <div>
            <select
                value={filterType}
                onChange={(e) => props.onFilterTypeChange(e.target.value)}
                style={{ marginRight: '5px' }}
            >
                <option value="contains">Պատասխանել</option> {/* Contains */}
                <option value="equals">Հավասար է</option> {/* Equals */}
            </select>
            <input
                type="text"
                value={filterText}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Փնտրել..." // "Search..." in Armenian
                style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
        </div>
    );
};

export default CustomTextFloatingFilter;
