import { ReactComponent as Logo } from "../../assets/icons/AV-logo.svg";
import bitmap from "../../assets/images/Bitmap.png";
import "./style.scss";
const AdminAuthLayout = ({ children }) => {
  return (
    <div className="authLayout">
      <div className="authBox">
        <div className="infoBox">
          <Logo className="logo" />
          <div className="textBox">
            <h3>Welcome to Auction Village</h3>
            <p>
              Manage user activities and track all <br /> transactions growth
            </p>
          </div>
          <img src={bitmap} className="bitmap" alt="bitmap" />
        </div>
        <div className="mainBox">{children}</div>
      </div>
    </div>
  );
};

export default AdminAuthLayout;
