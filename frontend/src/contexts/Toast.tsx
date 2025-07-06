import { useEffect, useState } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

export default function Toast({ 
  message, 
  type, 
  duration = 3000, 
  onClose,
  isVisible 
}: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          if (onClose) onClose();
          setIsClosing(false);
        }, 300); // Animation duration
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type} ${isClosing ? 'toast-closing' : ''}`}>
      <div className="toast-icon">
        {type === 'success' && <i className="fas fa-check-circle"></i>}
        {type === 'error' && <i className="fas fa-exclamation-circle"></i>}
        {type === 'info' && <i className="fas fa-info-circle"></i>}
      </div>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={() => onClose && onClose()}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
} 