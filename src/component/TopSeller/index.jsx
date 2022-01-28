import "./style.scss";
const TopSeller = ({ image, name, email, sales }) => {
  return (
    <div className="top-seller">
      <img src={image} alt="seller" />
      <div className="about-seller">
        <p className="name">{name}</p>
        <p className="email">{email}</p>
        {sales ? <p className="sales">{sales} Sales</p> : null}
      </div>
    </div>
  );
};

export default TopSeller;
