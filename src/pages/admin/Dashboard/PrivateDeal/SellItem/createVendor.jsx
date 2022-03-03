import { MenuItem, Select } from "@mui/material";
import { useRef } from "react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { toastr } from "react-redux-toastr";
import uploadImg from "../../../../../hook/UploadImg";
import { useAddVendorMutation } from "../../../../../services/api";
import saveImg from "../../../../../assets/icons/img.svg";
const CreateVendor = () => {
  // create vendor
  const [vendor_name, setVendorName] = useState("");
  const [vendor_email, setVendorEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [vendorType, setVendorType] = useState("");

  const ref2 = useRef();
  const ref = useRef();
  const [companyImg, setCompanyImg] = useState("");

  const createVendor = async () => {
    let url = await uploadImg(image, "n3mtymsx");
    const payload = {
      fullName: vendor_name,
      email: vendor_email,
      mobile: phone,
      avatar: url.secure_url,
      type: vendorType,
      isPrivate: true,
    };
    console.log(payload);
    onSubmitVendor(payload);
  };
  const [addVendor] = useAddVendorMutation();
  const [toggle, setToggle] = useState(true);
  const handleToggle = () => {
    setToggle(!toggle);
  };
  const [loader, setLoader] = useState(false);
  const onSubmitVendor = async (payload) => {
    setLoader(true);
    try {
      const response = await addVendor(payload).unwrap();
      //  closeModal();
      console.log(response, "response");

      toastr.success("Success", response.message);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      if (err.data) toastr.error("Error", err.data._meta.error.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  const FileChangeHandler2 = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyImg(URL.createObjectURL(e.target.files[0]));

      // ref.current.value = "";
    } else {
      console.log("nothing");
    }
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="">Vendor name </label>
        <div className="input-icon-wrap">
          {" "}
          <input
            autoComplete="off"
            type="text"
            id="vname"
            name="vname"
            placeholder="Vendor name"
            onChange={(e) => {
              setVendorName(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="">Vendor email </label>
        <div className="input-icon-wrap">
          {" "}
          <input
            autoComplete="off"
            type="text"
            id="vemail"
            name="vemail"
            placeholder="Vendor email"
            onChange={(e) => {
              setVendorEmail(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="form-group select-group">
        <label htmlFor="">Vendor name </label>

        <Select
          className="select-mui"
          ref={ref}
          value={vendorType}
          onChange={(value) => {
            console.log(value.target.value);
            setVendorType(value.target.value);
          }}
          displayEmpty
        >
          {[
            { label: "Individual", value: "INDIVDUAL" },
            { label: "Corporate", value: "CORPORATE" },
          ].map((item, i) => {
            return (
              <MenuItem
                key={`${item.value + i}`}
                className="menu-item"
                value={item.value}
              >
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      <div className="form-group">
        <label htmlFor="">Vendor Phone</label>
        <div className="input-icon-wrap">
          <PhoneInput
            country={"us"}
            value={phone}
            onChange={(phone) => {
              setPhone(phone);
            }}
          />
        </div>
      </div>

      <div className="companyLogoDiv">
        <p className="label">Company Logo (Optional)</p>

        <div className="logoCover">
          <label htmlFor="company">
            <img src={companyImg ? companyImg : saveImg} alt="save" />
            <p>
              Each picture must not exceed 5 Mb Supported formats are *.jpg,
              *.gif and *.png
            </p>
          </label>
          <input
            type="file"
            ref={ref2}
            onChange={(e) => {
              FileChangeHandler2(e);

              setImage(e.target.files[0]);
            }}
            hidden
            name="company"
            id="company"
          />
        </div>
      </div>
      <div className="toggleCover">
        <label className="switch">
          <input
            checked={toggle}
            onClick={handleToggle}
            onChange={createVendor}
            type="checkbox"
          />
          <span className="slider round"></span>
        </label>
        <p>Save Vendor</p>
      </div>
    </>
  );
};

export default CreateVendor;
