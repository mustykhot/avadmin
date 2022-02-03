import { Link } from "react-router-dom";
import chat from "../../assets/icons/chat2.svg";
import "./style.scss";

const ProfileBox = ({ name, email, account, tel, billing, img }) => {
  return (
    <div className="profileBox">
      <img src={img} className="profileImg" alt="userprofile" />
      <p className="username">{name}</p>
      <p className="email">{email}</p>
      <div className="actionBtn">
        <a href={`mailto:${email}`} className="email">
          Send email
        </a>
        <Link to="/chat" className="chat">
          <img src={chat} alt="chat" /> chat
        </Link>
      </div>

      <p className="details">Details</p>
      <div className="line"></div>
      <div className="eachDetails">
        <p className="detailTitle">Account ID</p>
        <p className="detailAns">{account}</p>
      </div>
      <div className="eachDetails">
        <p className="detailTitle">Mobile no.</p>
        <p className="detailAns">{tel}</p>
      </div>
      <div className="eachDetails">
        <p className="detailTitle">Billing Address</p>
        <p className="detailAns">{billing}</p>
      </div>

      {/* <div className="card">
              <p className="card">Card</p>
              <div className="cardList">
                <img src={Bitmap} alt="bitmap" />
                <div className="abtCard">
                  <div className="left">
                    <p className="type">Mastercard</p>
                    <p className="exp">Expires Feb 2022</p>
                  </div>
                  <Fill
                    onClick={() => {
                      setShowCard(!showCard);
                    }}
                    className="arr"
                  />
                </div>
              </div>
              {showCard && (
                <div className="cardInfo">
                  <p className="num">0898 2982 2928 2927</p>
                  <p className="exp">Expires Feb 2022</p>
                </div>
              )}
            </div> */}
    </div>
  );
};

export default ProfileBox;
