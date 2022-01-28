import { Link } from "react-router-dom";
import { useState } from "react";
import "./style.scss";
import bell from "../../assets/icons/bell.svg";
import fill from "../../assets/icons/Fill.svg";
import user from "../../assets/images/user.png";
const NavBar = () => {
  const [dnone, setDnone] = useState(false);

  return (
    <nav>
      <div className="navEnd">
        <div className="userSide">
          <img src={user} alt="fill" />
          <div className="dropSide">
            <div
              onClick={() => {
                setDnone(!dnone);
              }}
              className="boxIn"
            >
              <p className="name">Christopher</p>
              <img src={fill} alt="fill" />
            </div>

            <div className={`dropDown ${dnone ? "show" : ""}`}>
              <button className="logout">Log Out</button>
              <Link to="/" className="profile">
                Profile
              </Link>
            </div>
          </div>
          <div className="bellSide">
            <img src={bell} alt="bell" />
            <div className={`circle ${false ? dnone : ""}`}></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
