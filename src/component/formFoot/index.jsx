import { Link } from "react-router-dom";
import "./style.scss";
const FormFoot = ({ link, span, linkTo }) => {
  return (
    <div className="formFoot">
      <span>{span}</span>

      <Link to={linkTo}>{link}</Link>
    </div>
  );
};

export default FormFoot;
