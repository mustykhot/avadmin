import { Avatar } from "@mui/material";
import "./style.scss";
const TopSeller = ({ image, name, email, sales }) => {
  return (
    <div className="top-seller">
      <Avatar
        alt={"user"}
        src={image && image}
        sx={{ width: 35, height: 35 }}
      />
      <div className="about-seller">
        <p className="name">{name}</p>
        <p className="email">{email}</p>
        {sales ? <p className="sales">{sales} Sales</p> : null}
      </div>
    </div>
  );
};

export default TopSeller;
