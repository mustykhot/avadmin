import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import InputField from "../../../../../component/input/indexField";
import SelectField from "../../../../../component/input/select";
import { ReactComponent as AuctionIcon } from "../../../../../assets/icons/card.svg";
import { ReactComponent as BuyNowIcon } from "../../../../../assets/icons/ham.svg";
// import { ReactComponent as BuyNowIcon } from "../../../../../assets/icons/buyNowIcon.svg";
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

const Pricing = ({ display }) => {
  const { register, unregister, watch } = useFormContext();

  // show and unregister fields for auction and buy now fields
  const [pricingType, setPricingType] = useState("BUY_NOW");
  const handlePricingTypeChange = (type) => {
    setPricingType(type);
    if (type === "BUY_NOW") unregister([...auctionFields]);
    else if (type === "AUCTION") unregister([...buyNowFields]);
  };

  // show and unregister fields for online and offline bids

  const bidType = watch("biddingType");
  console.log(bidType);

  const [biddingType, setBiddingType] = useState("");
  const handleBiddingType = (e) => {
    const { value } = e.target;
    setBiddingType(value);
    if (value === "OFFLINE") {
      unregister(onlineBidFields);
    } else if (value === "ONLINE") {
      unregister(offlineBidFields);
    }
  };

  useEffect(() => {
    if (bidType) {
      setBiddingType(bidType);
      if (bidType === "OFFLINE") {
        unregister(onlineBidFields);
      } else if (bidType === "ONLINE") {
        unregister(offlineBidFields);
      }
    }
  }, [bidType]);

  let today = new Date().toISOString().split(".")[0];
  return (
    <div style={{ display: display ? "block" : "none" }}>
      <div className="pricing-btn-wrap">
        <label
          className={`pricing-btn ${pricingType === "AUCTION" ? "active" : ""}`}
          onClick={() => handlePricingTypeChange("AUCTION")}
        >
          <input
            {...register("type", { required: true })}
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
          onClick={() => handlePricingTypeChange("BUY_NOW")}
        >
          <input
            {...register("type", { required: true })}
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
        required={false}
      />
      <SelectField
        name="quantity"
        label="Quantity"
        errMsg="invalid field"
        selectOption={[
          {
            label: "Select Quantity",
            value: "",
          },
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
            // handleCustomChange={handleBiddingType}
            selectOption={[
              {
                label: `Select Bidding Type`,
                value: "",
              },
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
          {bidType === "ONLINE" && (
            <>
              <div className="form-group-wrap">
                <InputField
                  type="datetime-local"
                  name="startDate"
                  label="Start Date"
                  errMsg="invalid date"
                  // min={new Date().toISOString().split(".")[0]}
                />

                <InputField
                  type="datetime-local"
                  name="endDate"
                  label="End Date"
                  // min={new Date(startDate || today).toISOString().split(".")[0]}
                  errMsg="invalid date"
                />
              </div>
            </>
          )}

          {bidType === "OFFLINE" && (
            <>
              <div className="form-group-wrap">
                <InputField
                  type="date"
                  name="auctionDate"
                  label="Auction Date"
                  errMsg="invalid date"
                  required={false}
                  min={new Date().toISOString().split("T")[0]}
                />
                <InputField
                  type="time"
                  name="auctionTime"
                  required={false}
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
            selectOption={[
              {
                label: "Select Offer Type",
                value: "",
              },
              {
                label: "Negotiable",
                value: "Negotiable",
              },
              {
                label: "Non-negotiable",
                value: "Non-negotiable",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default Pricing;
