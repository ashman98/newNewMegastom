import React from 'react';
import {Tooltip } from 'react-tooltip';

const ScrollHint = () => {
    return (
        <div className="scroll-container" style={{ position: 'relative', display: 'flex', overflowX: 'scroll', padding: '10px' }}>

            {/* Пальчик, указывающий на возможность прокрутки */}
            <div
                className="scroll-hint"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '30px',
                    opacity: 0.8,
                    animation: 'bounce 1s infinite', // Анимация прыжка
                }}
                data-tip="Scroll Left/Right"
            >
                👉
            </div>

            {/* Подсказка, если используете react-tooltip */}
            <Tooltip place="top" effect="solid" />
        </div>
    );
};

export default ScrollHint;
