import React from 'react';

function ErrorModal({ isOpen, errorMessage, onClose, isTokenError, onLogout }) {
    const handleLogout = () => {
        onClose();
        if (isTokenError) {
            onLogout();
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-open' : ''}`}>
            <div className="modal-content">
                <h2>Error</h2>
                <p>{errorMessage}</p>

                {!isTokenError && <button onClick={onClose}>Cerrar</button>}
                {isTokenError && <button onClick={handleLogout}>Cerrar sesión</button>}
            </div>
        </div>
    );
}

export default ErrorModal;
