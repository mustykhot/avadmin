import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import "./style.scss";

import AboutPost from "./AboutPost";
import ItemDetails from "./ItemDetails";
import Pricing from "./Pricing";
import ShippingDetails from "./ShippingDetails";
import TnC from "./TnC";

import { useAddPrivateDealMutation } from "../../../../../services/api";
import { removeEmpty } from "../../../../../utils/utils";
import SubmitBtn from "../../../../../component/submitBtn";
import { toastr } from "react-redux-toastr";
import AdminDashboardLayout from "../../../../../component/adminDashboardLayout";

const TOTAL_STEPS = 5;

const CreatePrivateDeal = () => {
  const methods = useForm({
    mode: "all",
    defaultValues: {
      productInfo: {
        state: "Lagos",
        lga: "Ikeja",
        brandInformation: {
          color: "",
        },
      },
      type: "BUY_NOW",
    },
  });
  const [createDeal, { isLoading }] = useAddPrivateDealMutation();

  const [presentStep, setPresentStep] = useState(1);
  const [image, setImage] = useState([]);

  const onSubmit = async (data) => {
    let cred = {
      ...removeEmpty(data),
      isPrivate: true,
      productInfo: {
        ...removeEmpty(data.productInfo),
        termsInformation: {
          ...removeEmpty(data.productInfo.termsInformation),
        },
        brandInformation: {
          ...removeEmpty(data.productInfo.brandInformation),
        },
        photos: [...image],
        shippingInformation: {
          ...removeEmpty(data.productInfo.shippingInformation),
        },
      },
    };

    try {
      let response = await createDeal(cred).unwrap();
      console.log(response);
      // show toast

      toastr.success("Success", "Private Deal creation was successful");
      methods.reset();
      setImage([]);
      setTimeout(() => {
        setPresentStep(1);
      }, 4000);
    } catch (err) {
      console.log(err);
      if (err.status === "FETCH_ERROR") {
        toastr.error("Error", "Something went wrong, please try again...");
      } else {
        toastr.error("Error", err.data._meta.error.message);
      }
    }
    console.log(cred);
  };
  const stepTitles = [
    "About Post",
    "Item Details",
    "Pricing",
    "Shipping Details",
    "Terms & Conditions",
  ];

  const goNext = (num) => {
    setPresentStep(presentStep + num);
    console.log(methods.getValues(), image);
    if (methods.formState.isValid && image.length > 0) {
      console.log("valid");
    } else {
      console.log(methods.formState.errors, "not valid");
    }
  };
  return (
    <AdminDashboardLayout>
      <main className="sell-item-pg">
        <div className="inner">
          <div className="form-wrap">
            <div className="form-inner">
              <header className="form-header">
                <div className="title-wrap">
                  <h2>{stepTitles[presentStep - 1]}</h2>
                  <p className="clr-greyClr">Step {presentStep} of 5</p>
                  {/* <div className="btn-wrap">
                    <button
                      onClick={() => {
                        console.log(methods.getValues());
                        return presentStep > 1
                          ? setPresentStep(presentStep - 1)
                          : null;
                      }}
                      className="btn-accentBlue btn-small"
                    >
                      <ArrowBackIosIcon />
                    </button>
                    <button
                      onClick={() => goNext(1)}
                      className="btn-accentBlue btn-small"
                    >
                      <ArrowForwardIosIcon />
                    </button>
                  </div> */}
                </div>
              </header>
              <FormProvider {...methods}>
                <form
                  className="whito"
                  noValidate
                  onSubmit={methods.handleSubmit(onSubmit)}
                >
                  {/* {sections} */}
                  <br />
                  {presentStep >= 1 && (
                    <AboutPost
                      imgUrl={image}
                      setImgUrl={setImage}
                      display={presentStep === 1 ? true : false}
                    />
                  )}
                  {presentStep >= 2 && (
                    <ItemDetails display={presentStep === 2 ? true : false} />
                  )}
                  {presentStep >= 3 && (
                    <Pricing display={presentStep === 3 ? true : false} />
                  )}
                  {presentStep >= 4 && (
                    <ShippingDetails
                      display={presentStep === 4 ? true : false}
                    />
                  )}
                  {presentStep >= 5 && (
                    <TnC display={presentStep === 5 ? true : false} />
                  )}
                  <p>{methods.formState.isValid ? "Valid" : "Invalid"}</p>
                  <div className="btn-wrap form-footer">
                    <button
                      onClick={() =>
                        presentStep > 1 ? setPresentStep(presentStep - 1) : null
                      }
                      className="btn btn-accentBlue"
                      type="button"
                    >
                      {presentStep === 1 ? "Cancel" : "Previous"}
                    </button>
                    <SubmitBtn
                      btnText="Submit"
                      disabled={!methods.formState.isValid}
                      isLoading={isLoading}
                      style={{
                        display: presentStep === TOTAL_STEPS ? "unset" : "none",
                      }}
                    />
                    <button
                      style={{
                        display: presentStep < TOTAL_STEPS ? "unset" : "none",
                      }}
                      type="button"
                      disabled={!methods.formState.isValid || image.length <= 0}
                      onClick={() => goNext(1)}
                      className="btn-primary blue"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
};

export default CreatePrivateDeal;
