import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUser } from "../hook/getUserHook";

import { selectRates } from "../store/slice/CurrencySlice";
import { formatCurrency } from "../utils/utils";

function Currency({ price, country }) {
  const { shortCurrency, user, currency } = useGetUser();
  const rates = useSelector(selectRates);
  const [amount, setAmount] = useState(0);
  console.log(price, country, shortCurrency);

  useEffect(() => {
    if (rates) {
      if (country === user?.country) setAmount(price);
      else setAmount(Math.ceil(rates[shortCurrency] * price));
    }
  }, [country, price, rates, shortCurrency, user?.country]);

  return <span>{formatCurrency(currency, amount)}</span>;
}

export default Currency;
