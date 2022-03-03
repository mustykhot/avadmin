import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { ReactComponent as AddIcon } from "../../assets/icons/plusIcon.svg";
import "./style.scss";
import IconButton from "@mui/material/IconButton";

import { toaster } from "../../utils/utils";
import { CircularProgress } from "@mui/material";
import uploadImg, { deleteImg } from "../../services/UploadImg";

const UploadMultipleFile = ({
  id,
  name,
  labelText,
  setImgUrl,
  imgUrl,
  required = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [delToken, setDelToken] = useState([]);

  const delImg = async (img, token) => {
    try {
      let res = await deleteImg(token);
      console.log(token);
      console.log(res);
      if (res.result === "ok") {
        let newImages = imgUrl.filter((el) => img !== el);
        setImgUrl(newImages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploader = async (file) => {
    setIsLoading(true);
    if (file) {
      try {
        let url = await uploadImg(file, "n3mtymsx");
        setImgUrl([...imgUrl, url.secure_url]);
        setDelToken([...delToken, url.delete_token]);
      } catch (err) {
        setError("Image could not be uploaded");
        toaster("error", "Image could not be uploaded");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="form-group">
      {labelText && (
        <label style={{ marginBottom: 12 }} htmlFor={id || name}>
          {labelText} {required && <span className="clr-redClr">*</span>}
        </label>
      )}
      <div className="images-wrap">
        <div className="upload-file">
          <input
            type="file"
            onChange={(e) => uploader(e.target.files[0])}
            disabled={isLoading}
            name={name}
            id={id || name}
            accept="image/png, image/gif, image/jpeg"
          />
          <label htmlFor={id || name}>
            {isLoading ? <CircularProgress size={20} /> : <AddIcon />}
          </label>
          {error && <div className="input-err-msg">{error}</div>}
        </div>
        <>
          {imgUrl.map((el, i) => (
            <div key={el + i} className="upload-file">
              <label>
                <img className="img-slt" src={el} alt=" selected" />
                <IconButton
                  className="edit-icon"
                  onClick={() => delImg(el, delToken[i])}
                  aria-label="delete image"
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </label>
            </div>
          ))}
        </>
      </div>
    </div>
  );
};
export default UploadMultipleFile;
