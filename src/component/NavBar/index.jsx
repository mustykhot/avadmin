import { Link } from "react-router-dom";
import { useState } from "react";
import "./style.scss";
import bell from "../../assets/icons/bell.svg";
import fill from "../../assets/icons/Fill.svg";
import user from "../../assets/images/user.png";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { useGetUserDataQuery } from "../../services/api";
import { logout } from "../../store/slice/AuthSlice";
const NavBar = () => {
  const [dnone, setDnone] = useState(false);
  // const { user } = useSelector((state) => state.auth);

  const {
    data: user = null,
    isLoading: loading,
    isError,
    error,
  } = useGetUserDataQuery();
  const dispatch = useDispatch();
  const logOutAction = () => {
    dispatch(logout());
  };
  return (
    <nav>
      <div className="navEnd">
        <div className="userSide">
          <Avatar
            alt={"user"}
            src={user && user.data.avatar}
            sx={{ width: 35, height: 35 }}
          />
          <div style={{ marginLeft: "10px" }} className="dropSide">
            <div
              onClick={() => {
                setDnone(!dnone);
              }}
              className="boxIn"
            >
              <p className="name">
                {user && user.data.firstName} {user && user.data.lastName}
              </p>
              <img src={fill} alt="fill" />
            </div>

            <div className={`dropDown ${dnone ? "show" : ""}`}>
              <button onClick={logOutAction} className="logout">
                Log Out
              </button>
              {/* <Link to="/" className="profile"> 
                Profile
              </Link> */}
            </div>
          </div>
          {/* <div className="bellSide">
            <img src={bell} alt="bell" />
            <div className={`circle ${false ? dnone : ""}`}></div>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
