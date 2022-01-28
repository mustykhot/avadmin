import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AdminAuthLayout from "../../../component/adminAuthLayout";
import FormFoot from "../../../component/formFoot";
import FormHead from "../../../component/formHead";

import SuccessModal from "../../../component/popModal";
import SubmitBtn from "../../../component/submitBtn";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { setUserDetails, setUserToken } from "../../../store/slice/AuthSlice";
import InputField from "../../../component/input/indexField";
const Login = () => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const [login, { isLoading }] = useLoginMutation();
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(false);
  };
  const navigate = useNavigate();
  const onSubmit = async (vals) => {
    try {
      // call login trigger from rtk query
      const response = await login(vals).unwrap();

      // set user details and token in the state
      dispatch(setUserDetails(response));
      dispatch(setUserToken(response));

      toastr.success("Success", "Login Successful");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
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

export default Login;
