import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toastr } from "react-redux-toastr";
import { useState } from "react";
import { useAddAdminMutation } from "../../../services/api";
import FormHead from "../../formHead";
import Input from "../../input";
import Phone from "../../input/phone";
import Select from "../../input/selectt";
import Modal from "../../Modal";
import SubmitBtn from "../../submitBtn";
import InputField from "../../input/indexField";
const CreateAdminModal = ({ closeModal }) => {
  const methods = useForm();
  const [phone, setPhone] = useState("");

  // add admin

  const [addAdmin, { isLoading }] = useAddAdminMutation();

  const onSubmit = async (vals) => {
    const payload = {
      ...vals,
      mobile: phone,
      isAdmin: true,
      invitationRedirectUrl: "www.google.com",
      userType: "admin",
    };
    try {
      // call login trigger from rtk query
      const response = await addAdmin(payload).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };
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

  return (
    <Modal>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="createAdmin"
          action=""
        >
          <FormHead title={"Create Administrator"} subTitle={""} />
          <div className="group">
            <div className="halfInput">
              <InputField
                type="text"
                name="firstName"
                placeholder="Firstname"
                label="Firstname"
                id="firstname"
              />
            </div>
            <div className="halfInput">
              <InputField
                type="text"
                name="lastName"
                placeholder="Lastname"
                label="Lastname"
                id="lastname"
              />
            </div>
          </div>
          <InputField
            type="email"
            name="email"
            placeholder="Enter email address"
            label="Email"
            id="email"
          />

          <Phone label={"Mobile no"} telVal={phone} setTelVal={setPhone} />

          <InputField
            type="password"
            name="password"
            placeholder="Password"
            label="Password"
            id="Password"
          />
          {/* <Select
          label="Assign Role"
          id="role"
          name="role"
          register={register}
          selectOption={roleOption}
        /> */}

          <SubmitBtn isLoading={isLoading} btnText="Create Admin" />
          <button onClick={closeModal} type="button" className="cancel">
            Cancel
          </button>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default CreateAdminModal;
