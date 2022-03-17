import { useState } from "react";
import { useEffect } from "react";
import NaijaStates from "naija-state-local-government";
import UploadMultipleFile from "../../../../../component/UploadImgField/UploadMultipleFile";
import {
  useGetAllCategoryQuery,
  useGetAllPrivateVendorQuery,
} from "../../../../../services/api";
import InputField from "../../../../../component/input/indexField";
import SelectField from "../../../../../component/input/select";
import CreateVendor from "./createVendor";
const AboutPost = ({ display, imgUrl, setImgUrl }) => {
  // const { categories = [] } = useGetCt();
  const [create, setCreate] = useState(false);

  // get category
  const { data: category = null } = useGetAllCategoryQuery(1);

  // get vendor
  const { data: vendor = null } = useGetAllPrivateVendorQuery({
    page: 1,
    limit: 100,
    search: "",
  });

  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(
    () =>
      category
        ? setCategoryOptions(
            category.data.map((el) => ({
              label: el.name,
              value: el._id,
            }))
          )
        : null,
    [category]
  );

  const [activeState, setActiveState] = useState("Lagos");
  return (
    <div style={{ display: display ? "block" : "none" }}>
      <InputField
        type="text"
        name="productInfo.name"
        placeholder="Enter Item Name"
        label="Item Name"
      />
      <InputField
        type="number"
        name="admittanceFee"
        placeholder="Admittance Fee"
        label="Admittance Fee"
      />
      <SelectField
        name="productInfo.category"
        label="Item Category"
        errMsg="invalid field"
        // required={false}
        selectOption={[
          {
            label: "Select Category",
            value: "",
          },
          ...categoryOptions,
        ]}
        isLoading={categoryOptions.length <= 0}
      />
      <SelectField
        name="country"
        label="Country"
        errMsg="invalid field"
        // required={false}
        selectOption={[
          {
            label: "Select Country",
            value: "",
          },
          {
            label: "NIGERIA",
            value: "NIGERIA",
          },
          {
            label: "UNITED",
            value: "UNITED KINGDOM",
          },
        ]}
      />
      {/* <SelectField
        name="productInfo.subCategory"
        label="Sub Category"
        required={false}
        errMsg="invalid field"
        selectOption={[
          {
            label: "Select Sub Category",
            value: "",
          },
          ...categoryOptions,
        ]}
        isLoading={categoryOptions.length <= 0}
      /> */}
      <SelectField
        name="productInfo.state"
        label="State"
        errMsg="invalid field"
        handleCustomChange={(e) => setActiveState(e.target.value)}
        // selectOption={[
        //   {
        //     label: "Select State",
        //     value: "",
        //   },
        //   ...NaijaStates.states(),
        // ]}
        selectOption={NaijaStates.states().map((item) => ({
          label: item,
          value: item,
        }))}
      />
      <SelectField
        name="productInfo.lga"
        label="Town"
        errMsg="invalid field"
        // selectOption={[
        //   {
        //     label: "Select Town",
        //     value: "",
        //   },
        //   ...(NaijaStates.lgas(`${activeState}`)?.lgas || ""),
        // ]}
        selectOption={NaijaStates.lgas(`${activeState}`)?.lgas.map((item) => ({
          label: item,
          value: item,
        }))}
        isDisabled={NaijaStates.lgas(`${activeState}`)?.lgas ? false : true}
      />

      <UploadMultipleFile
        text="Upload Multiple Pictures"
        name="productInfo.photos"
        id="multi"
        labelText="Upload Pictures"
        imgUrl={imgUrl}
        setImgUrl={setImgUrl}
      />

      <SelectField
        name="vendor"
        label="Vendor"
        errMsg="invalid field"
        // required={false}

        selectOption={
          vendor
            ? vendor.data.map((item) => ({
                label: item.fullName,
                value: item.id,
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
      {create && <CreateVendor />}
    </div>
  );
};

export default AboutPost;
