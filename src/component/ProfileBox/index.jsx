import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Link, useNavigate } from "react-router-dom";
import chat from "../../assets/icons/chat2.svg";
import { useCreateChatMutation } from "../../services/api";
import Loaderhead from "../LoaderHead/loaderhead";
import "./style.scss";

const ProfileBox = ({ name, email, account, fname, tel, billing, img }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [createResponse, { isLoading: createLoading }] =
    useCreateChatMutation();
  const startChat = async () => {
    const payload = {
      senderId: user.id,
      receiverId: account,
    };

    try {
      const response = await createResponse(payload).unwrap();

      toastr.success("Success", response.message);
      setTimeout(() => {
        navigate(`/chat?id=${account}&fname=${fname}`);
      }, 3000);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };
  return (
    <div className="profileBox">
      <Loaderhead status={createLoading} />

      {/* <img src={img} className="profileImg" alt="userprofile" /> */}
      <Avatar alt={"user"} src={img} sx={{ width: 110, height: 110 }} />

      <p className="username">{name}</p>
      <p className="email">{email}</p>
      <div className="actionBtn">
        <a href={`mailto:${email}`} className="email">
          Send email
        </a>
        <button onClick={startChat} className="chat">
          <img src={chat} alt="chat" /> chat
        </button>
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
