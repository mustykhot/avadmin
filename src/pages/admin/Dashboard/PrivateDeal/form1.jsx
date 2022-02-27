/* eslint-disable react-hooks/exhaustive-deps */
import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import Select from "../../../../component/input/selectt";
import FormHeadFlex from "../../../../component/formHeadFlex";
import Input from "../../../../component/input";
import InputAmount from "../../../../component/input/inputAmount";
import MenuItem from "@mui/material/MenuItem";
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
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import uploadImg from "../../../../hook/UploadImg";
import { moveIn, moveLeft } from "../../../../utils/variants";
import { Select } from "@mui/material";

const PrivateDealForm1 = () => {
  const [isLoadng, setIsLoading] = useState(false);

  const [formStep, setFormStep] = useState(2);

  const [imageList, setImageList] = useState([]);
  // states

  const [recState, setRecState] = useState("Oyo");

  // get category
  const {
    data: category = null,
    isLoading: loading,
    isError,
    error,
  } = useGetAllCategoryQuery(1);

  // next step
  const completeFormStep = () => {
    setFormStep((cur) => cur + 1);
  };
  const prevFormStep = () => {
    setFormStep((cur) => cur - 1);
  };

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

  const [images, setImages] = useState([]);
  // get vendor
  const {
    data: vendor = null,
    isLoading: isVendLoading,
    isError: isVendError,
    error: vendErr,
  } = useGetAllPrivateVendorQuery({ page: 1, limit: 100 });

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
  const methods = useForm({
    mode: "all",
  });

  // create deal
  const [addDeal, { isLoading }] = useAddPrivateDealMutation();

  const onSubmit = async (vals) => {
    const payload = {
      ...vals,
      productInnfo: {
        ...vals.productInfo,
        photo: imgupload,
      },
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
  const [image, setImage] = useState("");
  const [vendorType, setVendorType] = useState("");

  const createVendor = async () => {
    let url = await uploadImg(image, "n3mtymsx");
    const payload = {
      fullName: vendor_name,
      email: vendor_email,
      mobiile: phone,
      avatar: url.secure_url,
      type: vendorType,
      isPrivate: true,
    };
    console.log(payload);
    onSubmitVendor(payload);
  };

  const [addVendor] = useAddVendorMutation();

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
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  // options
  const dealType = [
    { value: "BUY NOW", label: "Buy Now" },
    { value: "AUCTION", label: "Auction" },
  ];

  const offerType = [
    { value: "NEGOTIABLE", label: "Negotiable" },
    { value: "NON NEGOTIABLE", label: "Non Negotiable" },
  ];

  const biddingType = [
    { value: "ONLINE", label: "Online" },
    { value: "OFFLINE", label: "Offline" },
  ];

  return (
    <AdminDashboardLayout active="private">
      <div className="pd-private">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="createAdmin createForm"
            action=""
          >
            {" "}
            {formStep >= 0 && (
              <motion.section
                variants={moveIn}
                animate="visible"
                initial="hidden"
                exit="exit"
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
                  name="productInfo.category"
                  selectOption={
                    category
                      ? category.data.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))
                      : []
                  }
                />

                <InputField
                  type="text"
                  name="productInfo.name"
                  placeholder="Item Name"
                  label="Item Name"
                  id="item_name"
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
              </motion.section>
            )}{" "}
            {formStep >= 1 && (
              <motion.section
                variants={moveLeft}
                animate="visible"
                initial="hidden"
                exit="exit"
                style={{ display: `${formStep === 1 ? "block" : "none"}` }}
              >
                <FormHeadFlex title={"Item Details"} active={"2"} total={"4"} />

                <SelectField
                  label="Deal Type"
                  id="role"
                  name="type"
                  selectOption={dealType.map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                />

                <InputAmount
                  type="number"
                  name="basePrice"
                  placeholder="Enter Amount"
                  label="Base Price"
                  id="base_price"
                  errMsg="invalid  input"
                />

                <SelectField
                  label="Deal Type"
                  id="role"
                  name="type"
                  selectOption={dealType.map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                />

                <SelectField
                  label="Offer Type"
                  id="role"
                  name="offerType"
                  selectOption={offerType.map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                />

                <SelectField
                  label="Bidding Type"
                  id="role"
                  name="biddingType"
                  selectOption={biddingType.map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
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
                        name="location"
                        // onChange={(e) => {
                        //   console.log(e.target.value);
                        //   setRecState(e.target.value);
                        // }}
                        // selectOption={roleOption}
                        handleCustomChange={setRecState}
                        selectOption={[
                          { label: "Nigeria", value: "nigeria" },
                          { label: "USA", value: "usa" },
                        ]}
                      />
                    </div>
                    <div className="halfInput">
                      <SelectField
                        label=""
                        id="role"
                        name="state"
                        selectOption={NaijaStates.states().map((item) => ({
                          label: item,
                          value: item,
                        }))}
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
                        name="startDate"
                        placeholder="Start Date"
                        label="Start Date"
                        id="start_date"
                        errMsg="invalid  input"
                      />
                    </div>
                    <div className="halfInput">
                      <InputField
                        type="datetime-local"
                        name="endDate"
                        placeholder="End Date"
                        label="End Date"
                        id="end_date"
                        errMsg="invalid  input"
                      />
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
            {formStep >= 2 && (
              <motion.section
                variants={moveLeft}
                animate="visible"
                initial="hidden"
                exit="exit"
                style={{ display: `${formStep === 2 ? "block" : "none"}` }}
              >
                <FormHeadFlex
                  title={"Product Information"}
                  active={"3"}
                  total={"4"}
                />

                <SelectField
                  label="Select Vendor"
                  id="vendor"
                  name="vendor"
                  selectOption={
                    vendor
                      ? vendor.data.map((item) => ({
                          label: item.name,
                          value: item.email,
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
                )}

                <InputField
                  type="text"
                  name="shippingInformation.deliveryPeriod"
                  placeholder="5 days"
                  label="Delivery Period"
                  id="deliveryPeriod"
                  errMsg="invalid input"
                />
                <InputField
                  type="text"
                  name="shippingInformation.height"
                  placeholder=""
                  label="Height (m)"
                  id="height"
                  errMsg="invalid input"
                />

                {/* <PhoneInput
                  country={"us"}
                  value={phone}
                  onChange={(phone) => {
                    setPhone(phone);
                  }}
                /> */}
              </motion.section>
            )}
            {formStep >= 3 && (
              <motion.section
                variants={moveLeft}
                animate="visible"
                initial="hidden"
                exit="exit"
                style={{ display: `${formStep === 3 ? "block" : "none"}` }}
              >
                {" "}
                <FormHeadFlex
                  title={"Create Private Deal"}
                  active={"4"}
                  total={"4"}
                />
                <SelectField
                  label="Pickup?"
                  id="pickup"
                  name="shippingInformation.pickUpAvailable"
                  selectOption={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                />
                <InputField
                  type="text"
                  name="shippingInformation.width"
                  placeholder="5"
                  label="Width (m)"
                  id="width"
                  errMsg="invalid input"
                />
                <InputField
                  type="text"
                  name="shippingInformation.length"
                  placeholder="5"
                  label="Length (m)"
                  id="length"
                  errMsg="invalid input"
                />
                <InputField
                  type="text"
                  name="shippingInformation.weight"
                  placeholder="5"
                  label="Weight (kg)"
                  id="weight"
                  errMsg="invalid input"
                />
                <Textarea
                  type="text"
                  name="shippingInformation.description"
                  placeholder=""
                  label="Shipping Description"
                  id="shipping_description"
                  errMsg="invalid input"
                />
              </motion.section>
            )}
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
            <button
              onClick={completeFormStep}
              type="button"
              className="submit"
              style={{ display: `${formStep !== 3 ? "block" : "none"}` }}
              disabled={!methods.formState.isValid}
            >
              Continue
            </button>
            {formStep === 0 ? (
              ""
            ) : (
              <button
                disabled={!methods.formState.isValid}
                onClick={prevFormStep}
                type="button"
                className="cancel"
              >
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
