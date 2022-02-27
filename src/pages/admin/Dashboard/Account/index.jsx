import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import Modal from "../../../../component/Modal";
import FormHead from "../../../../component/formHead";
import Input from "../../../../component/input";
import { FormProvider, useForm } from "react-hook-form";
import SubmitBtn from "../../../../component/submitBtn";
import Select from "../../../../component/input/selectt";
import SuccessModal from "../../../../component/popModal";
import TableDrop from "../../../../component/TableDrop";
import Phone from "../../../../component/input/phone";
import { ReactComponent as Loka } from "../../../../assets/icons/loka.svg";
import { ReactComponent as Circ } from "../../../../assets/icons/circ.svg";
import InputField from "../../../../component/input/indexField";
import RajiFile from "../../../../component/input/RajiFile";
import {
  useUpdateMutation,
  useUpdatePasswordMutation,
} from "../../../../services/api";
import { toastr } from "react-redux-toastr";
import { useSelector } from "react-redux";
import uploadImg from "../../../../hook/UploadImg";
const Account = () => {
  const list = [1, 2, 3];
  const [modal, setModal] = useState(false);
  const [modalPop, setModalPop] = useState(false);
  const methods = useForm();
  const methods2 = useForm();
  const [isLoadng, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [imgupload, setImgUpload] = useState("");
  const [update, { isLoading }] = useUpdateMutation();

  const closeModal = () => {
    setModal(!modal);
  };
  const closeModalPop = () => {
    setModalPop(!modal);
  };
  const { user } = useSelector((state) => state.auth);
  const [updatePassword, { isLoading: passLoading }] =
    useUpdatePasswordMutation();
  const onSubmit = async (vals) => {
    let url = await uploadImg(vals.image[0], "n3mtymsx");

    const payload = {
      ...vals,
      mobile: phone,
      image: url.secure_url,
    };
    console.log(payload);
    setIsLoading(false);

    try {
      // call login trigger from rtk query
      const response = await update({
        credentials: payload,
        id: user.id,
      }).unwrap();
      console.log(response);
      toastr.success("Success", "Successful");
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  const onSubmit2 = async (vals) => {
    console.log(vals);
    setIsLoading(false);
    const payload = {
      currentPassword: vals.password,
      password: vals.newPassword,
    };

    try {
      // call login trigger from rtk query
      const response = await updatePassword(payload).unwrap();
      console.log(response);
      toastr.success("Success", "Successful");
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  const [focus, setFocus] = useState("profile");
  return (
    <AdminDashboardLayout active="account">
      <div className="pd-account">
        {modalPop && (
          <SuccessModal
            closeModal={closeModalPop}
            text={"Administrator created successfully!"}
          />
        )}
        <div className="topicPart">
          <p className="pageTitle">Account Setting</p>
        </div>

        <div className="flexPart">
          <div className="toggleBox">
            <div
              onClick={() => {
                setFocus("profile");
              }}
              className={`eachList ${focus === "profile" ? "active" : ""}`}
            >
              <Circ className="iconSide" />
              <p>Profile Details</p>
            </div>
            <div
              onClick={() => {
                setFocus("password");
              }}
              className={`eachList ${focus === "password" ? "active" : ""}`}
            >
              <Loka className="iconSide" />
              <p>Password Setting</p>
            </div>
          </div>

          <div className="whiteGuy">
            {focus === "profile" && (
              <div className="coverForm">
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    // className="loginBox2"
                    action=""
                  >
                    <FormHead title={"Profile Details"} />

                    <div className="group">
                      <div className="halfInput">
                        <InputField
                          type="text"
                          name="firstname"
                          placeholder="Firstname"
                          label="Firstname"
                          id="firstname"
                          errMsg="invalid input"
                        />
                      </div>
                      <div className="halfInput">
                        <InputField
                          type="text"
                          name="lastname"
                          placeholder="Lastname"
                          label="Lastname"
                          id="lastname"
                          errMsg="invalid input"
                        />
                      </div>
                    </div>

                    <RajiFile
                      name="image"
                      placeholder="Profile picture"
                      label="Profile picture"
                      id="image"
                      setFiler={setImgUpload}
                    />

                    {/* <InputField
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      label="Email"
                      id="email"
                      errMsg="invalid email input"
                    /> */}
                    <Phone
                      label={"Mobile no"}
                      telVal={phone}
                      setTelVal={setPhone}
                    />

                    <SubmitBtn isLoading={isLoading} btnText="Update" />
                  </form>
                </FormProvider>
              </div>
            )}
            {focus === "password" && (
              <div className="coverForm">
                <FormProvider {...methods2}>
                  <form onSubmit={methods2.handleSubmit(onSubmit2)} action="">
                    <FormHead title={"Profile Details"} />

                    <InputField
                      type="password"
                      name="password"
                      label="Current Password"
                      placeholder="Current Password"
                      id="password"
                      errMsg="invalid password"
                    />
                    <InputField
                      type="password"
                      name="newPassword"
                      label="New Password"
                      placeholder="New Password"
                      id="password"
                      errMsg="invalid password"
                    />

                    {/* <InputField
                      type="password"
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      id="password"
                      errMsg="invalid password"
                    /> */}

                    <SubmitBtn isLoading={passLoading} btnText="Update" />
                  </form>
                </FormProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Account;
