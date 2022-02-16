// import { ReactComponent as Cancel } from "../../assets/icons/Path.svg";
// import { ReactComponent as Mark } from "../../assets/icons/checkmark.svg";
import "./style.scss";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { backdrop, modal } from "../../utils/variants";
const Modal = ({ children, closeModal }) => {
  return (
    <motion.div
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={closeModal}
      className="pd-modal"
    >
      <motion.div variants={modal} className="popBox2">
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
