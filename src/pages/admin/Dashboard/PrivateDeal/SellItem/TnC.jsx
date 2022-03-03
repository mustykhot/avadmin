import InputField from "../../../../../component/input/indexField";
import SelectField from "../../../../../component/input/select";
import Textarea from "../../../../../component/input/textarea";

const TnC = ({ display }) => {
  return (
    <div style={{ display: display ? "block" : "none" }}>
      <div className="form-group-wrap">
        <InputField
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          step="1"
          name="productInfo.termsInformation.yearOfPurchase"
          label="Year of Purchase"
          required={false}
          errMsg={`Year should be between 1990 - ${new Date().getFullYear()} `}
        />

        <SelectField
          name="productInfo.termsInformation.repairHistory"
          label="Repair History"
          required={false}
          errMsg="invalid field"
          selectOption={[
            {
              label: "Select Option",
              value: "",
            },
            {
              label: "Yes",
              value: "Yes",
            },
            {
              label: "No",
              value: "No",
            },
          ]}
        />
      </div>
      <div className="form-group-wrap">
        <SelectField
          name="productInfo.termsInformation.warranty"
          label="Warranty"
          required={false}
          errMsg="invalid field"
          selectOption={[
            {
              label: "Select Warranty",
              value: "",
            },
            {
              label: "No warranty",
              value: "No warranty",
            },
            {
              label: "3 months",
              value: "3 months",
            },
            {
              label: "6 months",
              value: "6 months",
            },
            {
              label: "1 year",
              value: "",
            },
            {
              label: "2 years",
              value: "",
            },
          ]}
        />
        <SelectField
          name="productInfo.termsInformation.refundPolicy"
          required={false}
          label="Refund Policy"
          errMsg="invalid field"
          selectOption={[
            {
              label: "Select Option",
              value: "",
            },
            {
              label: "Yes",
              value: "Yes",
            },
            {
              label: "No",
              value: "No",
            },
          ]}
        />
      </div>
      <Textarea
        name="productInfo.termsInformation.otherInfo"
        placeholder="Enter Description"
        label="Other Information"
        errMsg="invalid field"
        required={false}
      />
    </div>
  );
};

export default TnC;
