import logo from "../../assets/icons/AV-logo.svg";
import { ReactComponent as Dash } from "../../assets/icons/sidebar/dash.svg";
import { ReactComponent as Admin } from "../../assets/icons/sidebar/admin.svg";
import { ReactComponent as Credit } from "../../assets/icons/sidebar/credit.svg";
import { ReactComponent as Users } from "../../assets/icons/sidebar/users.svg";
import { ReactComponent as Category } from "../../assets/icons/sidebar/category.svg";
import { ReactComponent as Ads } from "../../assets/icons/sidebar/ads.svg";
import { ReactComponent as Private1 } from "../../assets/icons/sidebar/private.svg";
import { ReactComponent as Chat1 } from "../../assets/icons/sidebar/chat1.svg";
import { ReactComponent as Audit } from "../../assets/icons/sidebar/audit.svg";
import { ReactComponent as Logout } from "../../assets/icons/sidebar/logout.svg";
import { ReactComponent as Setting } from "../../assets/icons/sidebar/set.svg";
import { ReactComponent as Ball } from "../../assets/icons/sidebar/ball.svg";
import { ReactComponent as Truck } from "../../assets/icons/sidebar/truckBus.svg";
import { ReactComponent as Shopping } from "../../assets/icons/sidebar/shopping.svg";
import { ReactComponent as Down } from "../../assets/icons/sidebar/downArr.svg";
// import { ReactComponent as Truck } from "../../assets/icons/sidebar/truck3.svg";
import { Link } from "react-router-dom";
import "./style.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slice/AuthSlice";

const SideBar = ({ active }) => {
  const chatCount = {
    backgroundColor: "red",
    marginLeft: "auto",
    borderRadius: "50%",
    color: "#fff",
    width: "17px",
    height: "17px",
    textAlign: "center",
  };
  const dispatch = useDispatch();
  const [showDrop, setShowDrop] = useState(false);
  const logOutAction = () => {
    dispatch(logout());
  };
  return (
    <div className="sideBar">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="sideNav">
        <Link
          className={`item ${active === "dashboard" ? "active" : ""}`}
          to="/dashboard"
        >
          <Dash className="iconSide" />
          <p>Dashboard</p>
        </Link>
        <Link
          className={`item ${active === "admin" ? "active" : ""}`}
          to="/admin"
        >
          <Admin className="iconSide" />
          <p>Administrators</p>
        </Link>
        <Link
          className={`item ${active === "transaction" ? "active" : ""}`}
          to="/transaction"
        >
          <Credit className="iconSide" />
          <p>Transactions</p>
        </Link>
        <Link
          className={`item ${active === "user" ? "active" : ""}`}
          to="/users"
        >
          <Users className="iconSide" />
          <p>All Users</p>
        </Link>
        <Link
          className={`item ${active === "category" ? "active" : ""}`}
          to="/category"
        >
          <Category className="iconSide" />
          <p>Catgories</p>
        </Link>
        <Link className={`item ${active === "ads" ? "active" : ""}`} to="/ads">
          <Ads className="iconSide" />
          <p>Ads Manager</p>
        </Link>
        <div className={`item extra `}>
          <div
            onClick={() => {
              setShowDrop(!showDrop);
            }}
            className="coverFirst"
          >
            <div className="first">
              <Private1 className="iconSide" />
              <p>Private Deal</p>
            </div>

            <Down className="down" />
          </div>
          {showDrop && (
            <div className="hidden">
              <Link
                to="/private"
                className={`eachHide ${active === "deal" ? "active" : ""}`}
              >
                <Shopping className="iconSide" /> <p>Deal</p>
              </Link>
              <Link
                to="/private-vendor"
                className={`eachHide ${active === "vendor" ? "active" : ""}`}
              >
                <Truck className="iconSide" /> <p>Private Vendors</p>
              </Link>
            </div>
          )}
        </div>

        <Link
          className={`item ${active === "auction" ? "active" : ""}`}
          to="/auction"
        >
          <Ball className="iconSide" />
          <p>Auction</p>
        </Link>

        <Link
          className={`item ${active === "plan" ? "active" : ""}`}
          to="/plan"
        >
          <Credit className="iconSide" />
          <p>Plan</p>
        </Link>

        <Link
          className={`item ${active === "chat" ? "active" : ""} chatcount`}
          to="/chat"
        >
          <Chat1 className="iconSide" />
          <p>Chats</p>
          {/* <div style={chatCount}>
            <p
              style={{
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "12px",
                width: "17px",
                height: "17px",
                borderRadius: "50%",
              }}
              className="numbercirlce"
            >
              3
            </p>
          </div> */}
        </Link>
        <Link
          className={`item ${active === "audit" ? "active" : ""}`}
          to="/audit"
        >
          <Audit className="iconSide" />
          <p>Audit trails</p>
        </Link>

        {/* <Link
          className={`item ${active === "shipping" ? "active" : ""}`}
          to="/shipping"
        >
          <Truck className="iconSide" />
          <p>Shipping</p>
        </Link> */}
      </div>

      <div className="setting">
        <p className="set">SETTINGS</p>

        <Link
          className={`item ${active === "account" ? "active" : ""}`}
          to="/account"
        >
          <Setting className="iconSide" />
          <p>Account</p>
        </Link>
        <button onClick={logOutAction} className="logout item">
          <Logout className="iconSide" />
          <p>Log Out</p>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
