import {useFormContext} from "react-hook-form";
import InputField from "../../../../../component/input/indexField";
import SelectField from "../../../../../component/input/select";
import Textarea from "../../../../../component/input/textarea";
import {
  useGetBrandModalQuery,
  useGetBrandQuery,
} from "../../../../../services/api";

const ItemDetails = ({display}) => {
  const {watch} = useFormContext();

  const {data: brands = null, isLoading, isError} = useGetBrandQuery();

  const brand = watch("productInfo.brandInformation.brand");
  const {
    data: models = null,
    isLoading: isModelLoading,
    isError: isModelError,
  } = useGetBrandModalQuery(brand || "");
  // const category = watch("newPassword");

  console.log(brands, models, "saka");

  return (
    <div style={{display: display ? "block" : "none"}}>
      <div className="form-group-wrap">
        <SelectField
          name="productInfo.brandInformation.brand"
          label="Brand"
          errMsg="invalid field"
          isLoading={isLoading}
          fetchErr={isError}
          placeholder="Select Brand"
          selectOption={
            brands
              ? brands.data.map(el => ({
                  label: el.name,
                  value: el._id,
                }))
              : []
          }
        />
        <SelectField
          name="productInfo.brandInformation.brandModel"
          label="Model"
          errMsg="invalid field"
          isLoading={isModelLoading}
          fetchErr={isModelError}
          placeholder="Select Model"
          selectOption={
            models
              ? models.data.map(el => ({
                  label: el.name,
                  value: el._id,
                }))
              : []
          }
        />
        {/* <InputField type="text" name="model" label="Model" required={false} /> */}
      </div>

      <InputField
        type="number"
        required={false}
        min="1900"
        max={new Date().getFullYear()}
        step="1"
        name="productInfo.brandInformation.yearOfManufacturer"
        label="Year of Manufacture"
        errMsg={`Year should be between 1990 - ${new Date().getFullYear()} `}
      />

      <div className="form-group-wrap">
        <InputField
          type="color"
          name="productInfo.brandInformation.color"
          required={false}
          label="Select Color"
          errMsg="invalid email input"
        />
        <InputField
          type="text"
          name="productInfo.brandInformation.transmission"
          required={false}
          label="Transmission"
        />
      </div>

      <SelectField
        name="productInfo.brandInformation.condition"
        label="Condition"
        errMsg="invalid field"
        selectOption={[
          {
            label: "Select Condition",
            value: "",
          },
          {
            label: "Brand New",
            value: "Brand New",
          },
          {
            label: "Used",
            value: "Used",
          },
          {
            label: "Seller Refurbished",
            value: "Seller Refurbished",
          },
          {
            label: "Manufacturer Refurbished",
            value: "Manufacturer Refurbished",
          },
        ]}
      />
      <Textarea
        name="productInfo.brandInformation.description"
        placeholder="Enter Description"
        label="Item Description"
        errMsg="invalid field"
      />
    </div>
  );
};

export default ItemDetails;
