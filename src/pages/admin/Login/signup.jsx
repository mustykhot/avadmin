import { useState } from "react";
import { useForm } from "react-hook-form";
import AdminAuthLayout from "../../../component/adminAuthLayout";
import FormHead from "../../../component/formHead";
import Input from "../../../component/input";
import SuccessModal from "../../../component/popModal";
import SubmitBtn from "../../../component/submitBtn";
import "./style.scss";

import Phone from "../../../component/input/phone";
import { useSignupMutation } from "../../../services/api";
import { SignalCellularAltSharp } from "@mui/icons-material";
import { toastr } from "react-redux-toastr";
const Signup = () => {
  const { register, formState, handleSubmit } = useForm();

  const [modal, setModal] = useState(false);
  const [phone, setPhone] = useState("");
  const closeModal = () => {
    setModal(false);
  };
  const [signup, { isLoading }] = useSignupMutation();
  const onSubmit = async (vals) => {
    console.log(vals);
    const payload = {
      ...vals,
      phone,
    };
    try {
      // call login trigger from rtk query
      const response = await signup(vals).unwrap();
      console.log(response);
      toastr.success("Success", "signup Successful");
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
    console.log(payload);
  };
  return (
    <div className="login">
      <AdminAuthLayout>
        <form onSubmit={handleSubmit(onSubmit)} className="loginBox" action="">
          <FormHead
            title={"Welcome Back!"}
            subTitle={"Login to your account"}
          />

          <Input
            type="email"
            name="email"
            placeholder="Enter email address"
            label="Email"
            id="email"
            register={register}
            errors={formState.errors}
            errMsg="invalid email input"
          />

          <Input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            label="First name"
            id="firstName"
            register={register}
            errors={formState.errors}
            errMsg="invalid input"
          />

          <Input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            label="Last name"
            id="lastName"
            register={register}
            errors={formState.errors}
            errMsg="invalid input"
          />

          <Phone label={"Mobile no"} telVal={phone} setTelVal={setPhone} />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Password"
            id="password"
            register={register}
            errors={formState.errors}
            errMsg="invalid password"
          />

          <SubmitBtn isLoading={false} btnText="Sign up" />
        </form>
      </AdminAuthLayout>
      {modal && (
        <SuccessModal
          closeModal={closeModal}
          text={"Password set successfully!"}
        />
      )}
    </div>
  );
};

export default Signup;
