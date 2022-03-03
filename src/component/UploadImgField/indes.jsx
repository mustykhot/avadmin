import {useState} from "react";
import {useFormContext} from "react-hook-form";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {ReactComponent as AddIcon} from "../../assets/icons/plusIcon.svg";
import "./style.scss";
import IconButton from "@mui/material/IconButton";

const UploadMultipleFile2 = ({name, labelText, required = true, ...props}) => {
  const {
    register,
    formState: {errors},
    setValue,
  } = useFormContext();

  const [isSelected, setIsSelected] = useState(false);
  const [images, setImages] = useState([]);

  function createFileList(files) {
    var b = new ClipboardEvent("").clipboardData || new DataTransfer();
    for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i]);
    console.log(b.files);
    return b.files;
  }

  const FileChangeHandler = e => {
    if (e.target.files) {
      setImages([
        ...images,
        ...createFileList(
          Array.from(e.target.files).map(el => new File([el], el.name))
        ),
      ]);
      console.log(images);
      setValue(name, [...images]);
      setIsSelected(true);
    } else setIsSelected(false);
  };

  const delImg = id => {
    let newImages = images.filter(el => id !== el);
    setImages(newImages);
    let newFiles = newImages.map(el => new File([el], el.name));
    setValue(name, createFileList(newFiles));
  };

  return (
    <div className="form-group">
      {labelText && <label htmlFor={props.id || name}>{labelText}</label>}
      <div className="images-wrap">
        <div className="upload-file">
          <input
            type="file"
            onClick={() => setIsSelected(false)}
            {...register(name, {
              required: required ? "This field is required" : false,
              onChange: e => {
                FileChangeHandler(e);
              },
            })}
            multiple
            name={name}
            accept="image/png, image/gif, image/jpeg"
            {...props}
          />
          <label
            className={`${isSelected && "picSelected"}`}
            htmlFor={props.id || name}
          >
            <AddIcon />
          </label>
          {errors[name] && <div className="input-err-msg">Invalid input</div>}
        </div>
        <>
          {images.map((el, i) => (
            <div key={el + i} className="upload-file">
              <label>
                <img
                  className="img-slt"
                  src={URL.createObjectURL(el)}
                  alt=" selected"
                />
                <IconButton
                  className="edit-icon"
                  onClick={() => delImg(el)}
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
export default UploadMultipleFile2;
