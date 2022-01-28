import "./style.scss";
const FormHead = ({ title, subTitle }) => {
  return (
    <div className="formHead">
      <p className="formTitle">{title}</p>
      <p className="formSubTitle">{subTitle}</p>
    </div>
  );
};

export default FormHead;
