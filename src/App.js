import ReduxToastr from "react-redux-toastr";
import Root from "./Root";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setExchangeRate } from "./store/slice/CurrencySlice";
const theme = createTheme({
  palette: {
    primary: {
      main: "#0052bd",
    },
    accentBlue: {
      main: "#f0f3fb",
      dark: "#DCDFF1",
    },
  },
  typography: {
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json`
    )
      .then((res) => res.json())
      .then((data) => {
        let rates = {
          ngn: data.eur.ngn,
          eur: parseFloat((1 / Math.round(data.eur.ngn)).toFixed(6)),
        };
        dispatch(setExchangeRate({ data: rates }));
      });
  }, [dispatch]);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Root />
        <ReduxToastr
          timeOut={40000}
          newestOnTop={false}
          preventDuplicates
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          position="top-center"
          removeOnHover={false}
          getState={(state) => state.toastr} // This is the default
          className="toastr"
          closeOnToastrClick={true}
        />
      </ThemeProvider>
    </>
  );
}

export default App;
