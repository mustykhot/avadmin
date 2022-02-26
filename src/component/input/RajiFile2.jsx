import { useState } from "react";
import { useFormContext } from "react-hook-form";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import "./upload.scss";
import uploadImg from "../../hook/UploadImg";

const RajiFile2 = ({
  id,
  name,
  required = true,
  label,
  setFiler,
  register,
  errors,
  placeholder = "Choose file to upload",
}) => {
  const [fileName, setFileName] = useState("");

  const FileChangeHandler = (e) => {
    console.log(e.target.files);

    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else setFileName("");
  };

  const [img, setImg] = useState("");

  const uploader = async (file) => {
    let url = await uploadImg(file, "n3mtymsx");
    setImg(url.secure_url);
    setFiler(url.secure_url);
  };

  return (
    <div className={"file-upload-wrap"}>
      <p className="label">{label}</p>
      <label
        className={`${errors[name] && "is-invalid"} file-input`}
        htmlFor={id || name}
      >
        <input
          type="file"
          name={name}
          id={id || name}
          {...register(name, {
            required: required ? "invalid field" : false,
            onChange: (e) => {
              FileChangeHandler(e);
              // uploader(e.target.files[0]);
            },
          })}
        />
        <CloudUploadOutlinedIcon />
        <span>{fileName ? fileName : placeholder}</span>
      </label>
      {errors[name] && (
        <div className="input-err-msg">{errors[name].message}</div>
      )}
    </div>
  );
};
export default RajiFile2;
