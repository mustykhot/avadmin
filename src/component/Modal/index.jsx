// import { ReactComponent as Cancel } from "../../assets/icons/Path.svg";
// import { ReactComponent as Mark } from "../../assets/icons/checkmark.svg";
import "./style.scss";
import { useState } from "react";
const Modal = ({ children, closeModal }) => {
  return (
    <div onClick={closeModal} className="pd-modal">
      <div className="popBox2">{children}</div>
    </div>
  );
};

export default Modal;
