import "./style.scss";
const NoProduct = ({ msg, btnText, icon, children, style, className }) => {
  return (
    <div style={style} className={`noService ${className}`}>
      <div className="coverBag clr-primary">
        {icon ? <img src={icon} alt="bag" /> : children}
      </div>
      <p className="noText">{msg}</p>
      {btnText && <button className="noPost">{btnText}</button>}
    </div>
  );
};

export default NoProduct;
