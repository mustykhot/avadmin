import {useState} from "react";
import {useFormContext} from "react-hook-form";
import InputField from "../../../../../component/input/indexField";
import SelectField from "../../../../../component/input/select";
import {ReactComponent as AuctionIcon} from "../../../../../assets/icons/card.svg";
import {ReactComponent as BuyNowIcon} from "../../../../../assets/icons/ham.svg";
const onlineBidFields = ["startDate", "endDate", "startTime", "endTime"];
const offlineBidFields = ["auctionDate", "auctionTime", "auctionAddress"];

const buyNowFields = [
  "basePrice",
  "quantity",
  "biddingType",
  ...offlineBidFields,
  ...onlineBidFields,
];
const auctionFields = ["basePrice", "quantity", "offerType"];

const Pricing = ({display}) => {
  const {register, unregister, watch} = useFormContext();

  // show and unregister fields for auction and buy now fields
  const [pricingType, setPricingType] = useState("BUY_NOW");
  const handlePricingTypeChange = type => {
    setPricingType(type);
    if (type === "BUY_NOW") unregister([...buyNowFields]);
    else if (type === "AUCTION") unregister([...auctionFields]);
  };

  // show and unregister fields for online and offline bids
  const [biddingType, setBiddingType] = useState("");
  const handleBiddingType = e => {
    const {value} = e.target;
    setBiddingType(value);
    if (value === "OFFLINE") {
      unregister(onlineBidFields);
    } else if (value === "ONLINE") {
      unregister(offlineBidFields);
    }
  };
  const startDate = watch("startDate");
  let today = new Date().toISOString().split(".")[0];
  return (
    <div style={{display: display ? "block" : "none"}}>
      <div className="pricing-btn-wrap">
        <label
          className={`pricing-btn ${pricingType === "AUCTION" ? "active" : ""}`}
        >
          <input
            {...register("type", {
              required: true,
              onChange: e => handlePricingTypeChange(e.target.value),
            })}
            type="radio"
            name="type"
            hidden
            value="AUCTION"
          />
          <AuctionIcon />
          Auctions
        </label>
        <label
          className={`pricing-btn ${pricingType === "BUY_NOW" ? "active" : ""}`}
        >
          <input
            {...register("type", {
              required: true,
              onChange: e => handlePricingTypeChange(e.target.value),
            })}
            type="radio"
            name="type"
            hidden
            value="BUY_NOW"
          />
          <BuyNowIcon />
          Buy Now
        </label>
      </div>
      <InputField
        type="number"
        name="basePrice"
        placeholder="Enter Amount"
        iconPlaceholder={"₦"}
        label="Base Price"
      />
      <SelectField
        name="quantity"
        label="Quantity"
        errMsg="invalid field"
        placeholder={"Select Quantity"}
        selectOption={[
          {
            label: "Single Item",
            value: "SINGLE_ITEM",
          },
          {
            label: "Lot",
            value: "LOT",
          },
        ]}
      />

      {pricingType === "AUCTION" && (
        <div>
          <SelectField
            name="biddingType"
            label="Type"
            handleCustomChange={handleBiddingType}
            placeholder="Select Bidding Type"
            selectOption={[
              {
                label: "Online",
                value: "ONLINE",
              },
              {
                label: "Offline",
                value: "OFFLINE",
              },
            ]}
          />
          {biddingType === "ONLINE" && (
            <>
              <div className="form-group-wrap">
                <InputField
                  type="datetime-local"
                  name="startDate"
                  label="Start Date"
                  errMsg="invalid date"
                  min={new Date().toISOString().split(".")[0]}
                />

                <InputField
                  type="datetime-local"
                  name="endDate"
                  label="End Date"
                  min={new Date(startDate || today).toISOString().split(".")[0]}
                  errMsg="invalid date"
                />
              </div>
            </>
          )}

          {biddingType === "OFFLINE" && (
            <>
              <div className="form-group-wrap">
                <InputField
                  type="date"
                  name="auctionDate"
                  label="Auction Date"
                  errMsg="invalid date"
                  min={new Date().toISOString().split("T")[0]}
                />
                <InputField
                  type="time"
                  name="auctionTime"
                  label="Auction Time"
                  errMsg="invalid field"
                />
              </div>
              <InputField
                type="text"
                name="address"
                label="Auction Address"
                errMsg="invalid field"
                placeholder="Enter auction address"
              />
            </>
          )}
        </div>
      )}

      {pricingType === "BUY_NOW" && (
        <div>
          <SelectField
            name="offerType"
            label="Offer Type"
            errMsg="invalid field"
            placeholder={"Select Offer Type"}
            selectOption={[
              {label: "Negotiable", value: "NEGOTIABLE"},
              {label: "Non-Negotiable", value: "NON_NEGOTIABLE"},
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default Pricing;
