import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AdminAuthLayout from "../../../component/adminAuthLayout";
import FormFoot from "../../../component/formFoot";
import FormHead from "../../../component/formHead";

import SuccessModal from "../../../component/popModal";
import SubmitBtn from "../../../component/submitBtn";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLoginnormalMutation } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { setUserDetails, setUserToken } from "../../../store/slice/AuthSlice";
import InputField from "../../../component/input/indexField";
const LoginNormal = () => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const [login, { isLoading }] = useLoginnormalMutation();
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(false);
  };
  const navigate = useNavigate();
  const onSubmit = async (vals) => {
    try {
      // call login trigger from rtk query
      const response = await login(vals).unwrap();
      console.log(response.data.data, "hhhhhhhhh");
      // set user details and token in the state
      dispatch(setUserDetails(response.data.data));
      dispatch(setUserToken(response._meta.token));

      toastr.success("", "Login Successful");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err) {
      console.log(err.data._meta.error.message, "err");

      if (err && err.data.status !== 401)
        toastr.error("", err.data._meta.error.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };
  return (
    <div className="login">
      <AdminAuthLayout>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="loginBox"
            action=""
          >
            <FormHead
              title={"Welcome Back!"}
              subTitle={"Login to your account"}
            />

            <InputField
              type="email"
              name="email"
              placeholder="Enter email address"
              label="Email"
              id="email"
              errMsg="invalid email input"
            />

            <InputField
              type="password"
              name="password"
              label="Password"
              placeholder="Password"
              id="password"
              errMsg="invalid password"
            />

            <SubmitBtn isLoading={isLoading} btnText="Log In" />
            <FormFoot span="" link="Forgot your password?" linkTo="/forget" />
          </form>
        </FormProvider>
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

export default LoginNormal;
