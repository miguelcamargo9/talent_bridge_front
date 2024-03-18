import React from "react";
import styles from "./ModalConfirm.module.scss";
import layoutStyles from "../Layout/Layout.module.scss";

interface ModalConfirmProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  show,
  onClose,
  onConfirm,
  children,
}) => {
  if (!show) {
    return null;
  }

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose} data-testid="modal-backdrop">
      <div className={styles.modalContent} onClick={stopPropagation} data-testid="modal-content">
        {children}
        <div className={styles.buttonContainer}>
          <button
            onClick={onClose}
            className={`${layoutStyles.button} ${layoutStyles.secondary}`}
          >
            Cancel
          </button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
