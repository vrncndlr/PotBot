import React from 'react';
import '../styling/modal.css'

function Modal({message, active}) {
  return (
    <>
      <div className={`modal ${active ? 'modal--active' : ''}`}>
        {message}
      </div>
    </>
  );
}

export default Modal;
