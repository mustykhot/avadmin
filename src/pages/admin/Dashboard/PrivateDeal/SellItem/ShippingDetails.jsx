import InputField from "../../../../../component/input/indexField";
import SelectField from "../../../../../component/input/select";
import Textarea from "../../../../../component/input/textarea";

const ShippingDetails = ({ display }) => {
  return (
    <div style={{ display: display ? "block" : "none" }}>
      <div className="form-group-wrap">
        <InputField
          type="number"
          name="productInfo.shippingInformation.weight"
          required={false}
          placeholder="Enter Item Weight"
          label="Weight (kg)"
          errMsg="invalid field"
        />
        <InputField
          type="number"
          name="productInfo.shippingInformation.length"
          required={false}
          placeholder="Enter Item Length"
          label="Length (cm)"
          errMsg="invalid field"
        />
      </div>
      <div className="form-group-wrap">
        <InputField
          type="number"
          required={false}
          name="productInfo.shippingInformation.width"
          placeholder="Enter Item Width"
          label="Width (cm)"
          errMsg="invalid field"
        />
        <InputField
          type="number"
          required={false}
          name="productInfo.shippingInformation.height"
          placeholder="Enter Item Height"
          label="Height (cm)"
          errMsg="invalid field"
        />
      </div>
      <div className="form-group-wrap">
        <SelectField
          name="productInfo.shippingInformation.deliveryPeriod"
          label="Delivery Period"
          errMsg="invalid field"
          selectOption={[
            {
              label: "Select Option",
              value: "",
            },
            {
              label: "1 month",
              value: "1 month",
            },
            {
              label: "2 months",
              value: "2 months",
            },
          ]}
        />
        <SelectField
          name="productInfo.shippingInformation.pickUpAvailable"
          label="Pickup Available"
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
        name="productInfo.shippingInformation.description"
        required={false}
        placeholder="Enter Description"
        label="Shipping Description"
        errMsg="invalid field"
      />
    </div>
  );
};

export default ShippingDetails;
