/* eslint-disable react-hooks/exhaustive-deps */
import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import Select from "../../../../component/input/selectt";
import FormHeadFlex from "../../../../component/formHeadFlex";
import Input from "../../../../component/input";
import InputAmount from "../../../../component/input/inputAmount";

import { useRef } from "react";
import Textarea from "../../../../component/input/textarea";
import saveImg from "../../../../assets/icons/img.svg";
import Phone from "../../../../component/input/phone";
import PhoneInput from "react-phone-input-2";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useAddPrivateDealMutation,
  useAddVendorMutation,
  useGetAllCategoryQuery,
  useGetAllPrivateVendorQuery,
} from "../../../../services/api";
import { toastr } from "react-redux-toastr";
import NaijaStates from "naija-state-local-government";
import SelectField from "../../../../component/input/select";
import InputField from "../../../../component/input/indexField";
import uploadImg from "../../../../hook/UploadImg";
const PrivateDealForm1 = () => {
  const [isLoadng, setIsLoading] = useState(false);

  const [formStep, setFormStep] = useState(0);
  console.log(formStep);
  const [imageList, setImageList] = useState([]);
  // states

  const [recState, setRecState] = useState("Oyo");

  // get category
  const {
    data: category = [],
    isLoading: loading,
    isError,
    error,
  } = useGetAllCategoryQuery();

  const roleOption = [
    {
      label: "None Financial",
      value: "none",
    },
    {
      label: "None Financial2",
      value: "none2",
    },
  ];

  // next step
  const completeFormStep = () => {
    // console.log(methods.formState.error);
    // console.log(methods.getValues());
    // if (methods.formState.isValid) {
    //   setFormStep((cur) => cur + 1);
    // }
    setFormStep((cur) => cur + 1);
  };
  const prevFormStep = () => {
    setFormStep((cur) => cur - 1);
  };

  // const goNext = (num) => {
  //   if (methods.formState.isValid) {
  //     setPresentStep(presentStep + num);
  //     console.log(methods.getValues());
  //   } else {
  //     console.log(methods.formState.errors, "not valid");
  //   }
  // };

  // file adding
  const ref = useRef();
  const FileChangeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageList([...imageList, URL.createObjectURL(e.target.files[0])]);
    } else {
      console.log("nothing");
    }
  };
  // file list
  const [imgupload, setImgUpload] = useState([]);
  const uploader = async (file) => {
    let url = await uploadImg(file, "n3mtymsx");
    setImgUpload([...imgupload, url.secure_url]);
  };

  console.log(imgupload, "imgupload");

  // function for image gangan

  // const [isSelected, setIsSelected] = useState(false);
  const [images, setImages] = useState([]);

  function createFileList(files) {
    var b = new ClipboardEvent("").clipboardData || new DataTransfer();
    for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i]);
    return b.files;
  }

  const FileChangeHandlerGan = (e) => {
    console.log(e.target.files);
    if (e.target.files.length === 0) {
      setImages([]);
      // setIsSelected(false);
    } else {
      setImages(Array.from(e.target.files));
      // let newFiles = Array.from(e.target.files).map(
      //   (el) => new File([el], el.name)
      // );
      // setIsSelected(true);
    }
  };
  // get vendor
  const {
    data: vendor = null,
    isLoading: isVendLoading,
    isError: isVendError,
    error: vendErr,
  } = useGetAllPrivateVendorQuery({ page: 1, limit: 100 });
  console.log(vendor, "sssssss");

  // form 2

  const [create, setCreate] = useState(false);

  const ref2 = useRef();
  const [companyImg, setCompanyImg] = useState("");

  const FileChangeHandler2 = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyImg(URL.createObjectURL(e.target.files[0]));

      // ref.current.value = "";
    } else {
      console.log("nothing");
    }
  };
  const [img, setImg] = useState("");
  const uploader2 = async (file) => {
    let url = await uploadImg(file, "n3mtymsx");
    setImg(url.secure_url);
  };
  const [toggle, setToggle] = useState(true);
  const handleToggle = () => {
    setToggle(!toggle);
  };
  const methods = useForm();

  // create deal
  const [addDeal, { isLoading }] = useAddPrivateDealMutation();

  const onSubmit = async (vals) => {
    const payload = {
      ...vals,
      photo: imgupload,
    };
    console.log(payload);

    try {
      const response = await addDeal(payload).unwrap();
      //  closeModal();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  // create vendor
  const [vendor_name, setVendorName] = useState("");
  const [vendor_email, setVendorEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vendorCategory, setVendorCategory] = useState("");
  const createVendor = () => {
    const payload = {
      name: vendor_name,
      email: vendor_email,
      phonenumber: phone,
      photo: img,
    };
    console.log(payload);
    onSubmitVendor(payload);
  };
  const dealType = [
    { value: "BUY NOW", label: "Buy Now" },
    { value: "AUCTION", label: "Auction" },
  ];

  const [addVendor] = useAddVendorMutation();

  const [loader, setLoader] = useState(false);
  console.log(loader, "loader");
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
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  return (
    <AdminDashboardLayout active="private">
      <div className="pd-private">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="createAdmin"
            action=""
          >
            {formStep >= 0 && (
              <section
                style={{ display: `${formStep === 0 ? "block" : "none"}` }}
              >
                <FormHeadFlex
                  title={"Create Private Deal"}
                  active={"1"}
                  total={"4"}
                />

                <SelectField
                  label="Select Category"
                  id="role"
                  name="categoryName"
                  selectOption={category.map((item) => ({
                    label: item.categoryName,
                    value: item.categoryName,
                  }))}
                />

                {/* <button
                  onClick={completeFormStep}
                  type="button"
                  className="submit"
                  disabled={!methods.formState.isValid}
                >
                  Continue
                </button> */}
              </section>
            )}
            {formStep >= 1 && (
              <section
                style={{ display: `${formStep === 1 ? "block" : "none"}` }}
              >
                <FormHeadFlex title={"Item Details"} active={"2"} total={"4"} />

                <SelectField
                  label="Deal Type"
                  id="role"
                  name="dealType"
                  selectOption={dealType.map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                />

                <InputField
                  type="text"
                  name="productName"
                  placeholder="Item Name"
                  label="Item Name"
                  id="item_name"
                  errMsg="invalid input"
                />

                <InputField
                  type="number"
                  name="quantity"
                  placeholder=""
                  label="Quantity"
                  id="quantity"
                  errMsg="invalid input"
                />

                <InputAmount
                  type="number"
                  name="basePrice"
                  placeholder="Enter Amount"
                  label="Base Price"
                  id="base_price"
                  errMsg="invalid  input"
                />

                <div className="coverGroup">
                  <label
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      lineHeight: "14px",
                      color: "#4a4a4a",
                      marginBottom: "5px",
                    }}
                  >
                    Item Location
                  </label>
                  <div style={{ marginTop: "5px" }} className="group">
                    <div className="halfInput">
                      <SelectField
                        label=""
                        id="state"
                        name="state"
                        // onChange={(e) => {
                        //   console.log(e.target.value);
                        //   setRecState(e.target.value);
                        // }}
                        // selectOption={roleOption}
                        handleCustomChange={setRecState}
                        selectOption={NaijaStates.states().map((item) => ({
                          label: item,
                          value: item,
                        }))}
                      />
                    </div>
                    <div className="halfInput">
                      <SelectField
                        label=""
                        id="role"
                        name="lga"
                        selectOption={NaijaStates.lgas(recState).lgas.map(
                          (item) => ({
                            label: item,
                            value: item,
                          })
                        )}
                        // selectOption={roleOption}
                      />
                    </div>
                  </div>
                </div>

                <div className="coverGroup">
                  <div style={{ marginTop: "5px" }} className="group">
                    <div className="halfInput">
                      <InputField
                        type="datetime-local"
                        name="start_date"
                        placeholder="Start Date"
                        label="Start Date"
                        id="start_date"
                        errMsg="invalid  input"
                      />
                    </div>
                    <div className="halfInput">
                      <InputField
                        type="datetime-local"
                        name="end_date"
                        placeholder="End Date"
                        label="End Date"
                        id="end_date"
                        errMsg="invalid  input"
                      />
                    </div>
                  </div>
                </div>

                {/* <button
                  onClick={completeFormStep}
                  type="button"
                  className="submit"
                  disabled={!methods.formState.isValid}
                >
                  Continue
                </button>
                <button onClick={prevFormStep} type="button" className="cancel">
                  back
                </button> */}
              </section>
            )}
            {formStep >= 2 && (
              <section
                style={{ display: `${formStep === 2 ? "block" : "none"}` }}
              >
                <FormHeadFlex
                  title={"Product Information"}
                  active={"2"}
                  total={"4"}
                />

                <Textarea
                  type="text"
                  name="description"
                  placeholder="Description"
                  label="Product Description"
                  id="description"
                  errMsg="invalid input"
                />

                <div className="imageCollect">
                  <p className="label">Add photo</p>
                  <p className="subLabel">
                    First picture - is the title picture. You can change the
                    order of photos: just grab your photos and drag
                  </p>
                  <div className="fileDiv">
                    <div className="collectFile">
                      <label htmlFor="productImg">
                        <img src={saveImg} alt="save" />
                        <p>
                          Each picture must not exceed 5 Mb <br /> Supported
                          formats are *.jpg, *.gif and *.png
                        </p>
                      </label>
                      <input
                        type="file"
                        hidden
                        name="productImg"
                        id="productImg"
                        ref={ref}
                        // value={images}
                        onChange={(e) => {
                          FileChangeHandler(e);
                          // FileChangeHandlerGan(e);
                          setImages([...images, e.target.files]);
                          uploader(e.target.files[0]);
                        }}
                        accept="image/png, image/gif, image/jpeg"
                      />
                    </div>
                    <div className="displayFile">
                      {imageList.map((item, i) => {
                        return <img src={item} key={i} alt="item" />;
                      })}
                    </div>
                  </div>
                </div>

                {/* <button
                  onClick={completeFormStep}
                  type="button"
                  className="submit"
                  disabled={!methods.formState.isValid}
                >
                  Continue
                </button>
                <button onClick={prevFormStep} type="button" className="cancel">
                  back
                </button> */}
              </section>
            )}
            {formStep >= 3 && (
              <section
                style={{ display: `${formStep === 3 ? "block" : "none"}` }}
              >
                {" "}
                <FormHeadFlex
                  title={"Create Private Deal"}
                  active={"3"}
                  total={"3"}
                />
                <SelectField
                  label="Select Vendor"
                  id="vendor"
                  name="vendor"
                  selectOption={
                    vendor
                      ? vendor.rows.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))
                      : []
                  }
                />
                <button
                  onClick={() => {
                    setCreate(!create);
                  }}
                  type="button"
                  className="add"
                >
                  +Add New Vendor
                </button>
                {create && (
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
                          <img
                            src={companyImg ? companyImg : saveImg}
                            alt="save"
                          />
                          <p>
                            Each picture must not exceed 5 Mb Supported formats
                            are *.jpg, *.gif and *.png
                          </p>
                        </label>
                        <input
                          type="file"
                          ref={ref2}
                          onChange={(e) => {
                            FileChangeHandler2(e);
                            uploader2(e.target.files[0]);
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
                )}
              </section>
            )}

            {formStep >= 3 ? (
              <button
                type="submit"
                className="submit"
                // disabled={!methods.formState.isValid}
                style={{ display: `${formStep === 3 ? "" : "none"}` }}
                onClick={() => {
                  console.log("ggg");
                }}
              >
                {loader ? (
                  <FontAwesomeIcon icon={faSpinner} pulse spin />
                ) : (
                  "Submit"
                )}
              </button>
            ) : (
              <button
                onClick={completeFormStep}
                type="button"
                className="submit"
                // disabled={!methods.formState.isValid}
              >
                Continue
              </button>
            )}
            {formStep === 0 ? (
              ""
            ) : (
              <button onClick={prevFormStep} type="button" className="cancel">
                Back
              </button>
            )}
          </form>
        </FormProvider>
      </div>
    </AdminDashboardLayout>
  );
};

export default PrivateDealForm1;
