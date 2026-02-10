import { useState, useEffect } from 'react';
import './toast.css';

// Composant de notification non bloquante
const Toast = ({ message, type = 'info', onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Attend la fin de l'animation
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type} ${visible ? 'toast-enter' : 'toast-exit'}`}>
            <span className="toast-icon">
                {type === 'success' && '✓'}
                {type === 'error' && '✕'}
                {type === 'info' && 'ℹ'}
            </span>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={() => { setVisible(false); setTimeout(onClose, 300); }}>×</button>
        </div>
    );
};

export default Toast;
