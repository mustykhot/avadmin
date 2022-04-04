import {useEffect, useState} from "react";
import {useGetUser} from "../hook/getUserHook";
import AutoCompleteField from "./input/AutoCompleteField";

function StateCitySelect({country = "NIGERIA"}) {
  const {user} = useGetUser();
  const [activeState, setActiveState] = useState("");
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);

  useEffect(() => {
    let requestOptions = {
      method: "POST",
      body: JSON.stringify({
        country: country || user?.country,
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        accept: "*/*",
      },
      redirect: "follow",
    };
    if (country || user?.country) {
      fetch(
        `https://countriesnow.space/api/v0.1/countries/states`,
        requestOptions
      )
        .then(res => res.json())
        .then(data => {
          setStates(data.data.states.map(el => el.name));
        })
        .catch(err => console.log(err));
    }
  }, [country, user?.country]);

  useEffect(() => {
    let requestOptions = {
      method: "POST",
      body: JSON.stringify({
        country: country || user?.country,
        state: activeState?.split(" State")[0],
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      redirect: "follow",
    };
    if (activeState?.split(" State")[0]) {
      fetch(
        `https://countriesnow.space/api/v0.1/countries/state/cities`,
        requestOptions
      )
        .then(res => res.json())
        .then(data => {
          setCities(data.data);
        })
        .catch(err => console.log(err));
    }
  }, [activeState, country, user?.country]);

  return (
    <>
      <AutoCompleteField
        name="state"
        label="State"
        errMsg="invalid field"
        placeholder={states ? "Select State" : "Loading..."}
        handleCustomChange={value => {
          setActiveState(value);
        }}
        selectOption={states}
        disabled={states ? false : true}
      />
      <AutoCompleteField
        name="lga"
        label="City"
        placeholder={states ? "Select City" : "Loading..."}
        errMsg="invalid field"
        freeSolo
        selectOption={cities}
        disabled={cities ? false : true}
      />
    </>
  );
}

export default StateCitySelect;
