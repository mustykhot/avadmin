import ReduxToastr from "react-redux-toastr";
import Root from "./Root";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import "./index.scss";
const theme = createTheme({
  palette: {
    primary: {
      main: "#0052bd",
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
          getState={state => state.toastr} // This is the default
          className="toastr"
          closeOnToastrClick={true}
        />
      </ThemeProvider>
    </>
  );
}

export default App;
