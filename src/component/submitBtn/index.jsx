import "./style.scss";
const SubmitBtn = ({
  isLoading,
  btnText,
  className,
  style,
  disabled,
  ...props
}) => {
  return (
    <button
      type="submit"
      {...props}
      style={style}
      className={`btn-primary submit-btn ${className ? className : ""}`}
      disabled={isLoading || disabled}
    >
      {isLoading ? <div className="spin" /> : btnText}
    </button>
  );
};

export default SubmitBtn;
