import { FiAlertTriangle, FiX } from 'react-icons/fi';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', type = 'warning' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>
        
        <div className={`modal-icon modal-icon-${type}`}>
          <FiAlertTriangle />
        </div>
        
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className={`modal-btn modal-btn-confirm modal-btn-${type}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
