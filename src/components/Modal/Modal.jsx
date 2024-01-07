import React, { useEffect } from 'react';
import css from './Modal.module.css';

export const Modal = ({ modalData, handleCloseModal }) => {
  useEffect(() => {
    const handleKeyPress = event => {
      if (event.code === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleCloseModal]);

  const handleBackdropClick = event => {
    if (event.target === event.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <img src={modalData.largeImageURL} alt={modalData.tags} />
      </div>
    </div>
  );
};
