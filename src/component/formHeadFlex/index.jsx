import "./style.scss";
const FormHeadFlex = ({ title, active, total }) => {
  return (
    <div className="formHeadFlex">
      <p className="formTitle">{title}</p>
      <p className="formPage">
        <span className="active">{active}</span> of{" "}
        <span className="">{total}</span>
      </p>
    </div>
  );
};

export default FormHeadFlex;
