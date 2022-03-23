/* eslint-disable no-useless-escape */
import { toastr } from "react-redux-toastr";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
//Format value with comma and add Naira sign

// Format number to thousandth(k) or millionth(m)
export const kFormatter = (num, amount) => {
  num = Math.round(num);
  if (999 < num && num < 1000000) {
    return amount + Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k";
  } else if (1000000 < num && num < 1000000000) {
    return amount + Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + "m";
  } else if (100000000 < num && num < 1000000000000) {
    return (
      amount + Math.sign(num) * (Math.abs(num) / 1000000000).toFixed(1) + "b"
    );
  } else {
    let value;
    value = Math.sign(num) * Math.abs(num);
    if (isNaN(value)) value = "";
    return value;
  }
};

export const moneyFormatter = (val, amount) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(val)) >= 1.0e9
    ? (Math.abs(Number(val)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(val)) >= 1.0e6
    ? (Math.abs(Number(val)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(val)) >= 1.0e3
    ? (Math.abs(Number(val)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(val))
    ? Math.abs(Number(val) / 1.0)
    : Math.abs(Number(val)) >= 1.0
    ? isNaN(val)
    : "";

  // ? ({ val = Math.sign(val) * Math.abs(val) })
};

// capitalize first letter of each word in a sentence
export function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

export const checkPermission = (permissions, permission) => {
  const userPerm = permissions.map((data) => data.permission_name);
  if (!userPerm?.includes(permission)) {
    toastr.error("", "You don't have the Admin rights to do this");
    return false;
  } else {
    return true;
  }
};

// export const formatCurrency = (amount) => {
//   return Number(amount)
//     .toFixed(2)
//     .replace(/\d(?=(\d{3})+\.)/g, "$&,");
// };

export const formatCurrency = (currency, amount) => {
  return toCurrency(currency, amount).split(".00")[0];
};
//toast PopUp
export const toastPopUp = (
  cb,
  okText,
  cancelText,
  blockName,
  blockText,
  color
) => {
  const toastrConfirmOptions = {
    onOk: () => cb(),
    okText: okText,
    cancelText: cancelText,
    component: () => (
      <div
        style={{
          padding: "1rem 2rem",
          position: "relative",
          display: "flex",
        }}
      >
        <p
          style={{ color: `${color}`, marginLeft: "auto", marginRight: "auto" }}
        >
          {blockName} {blockText && blockText.toUpperCase()}
        </p>
      </div>
    ),
  };
  toastr.confirm(null, toastrConfirmOptions);
};

// Check if url is valid
export function isValidURL(string) {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );

  if (res !== null) return true;
}

// truncate string
export const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
};

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// custom toaster
export const toaster = (type, msg) => {
  switch (type) {
    case "success":
      toastr.success("", msg, {
        icon: <CheckIcon color="white" />,
      });
      break;
    case "error":
      toastr.error("", msg, {
        icon: <ErrorIcon color="white" />,
      });
      break;
    case "warn":
      toastr.warning("Warning", msg, {
        icon: <WarningIcon color="white" />,
      });
      break;

    default:
      break;
  }
};

// remove empty objects and array from the obj
export const removeEmpty = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (typeof v === "number") return true;
      else if (typeof v === "object" && Object.keys(v).length > 0) return true;
      else return v !== "" && v && v?.length > 0;
    })
  );
};

export const toCurrency = (country = "en-NG", number) => {
  const formatter = new Intl.NumberFormat(country, {
    style: "currency",
    currency: country === "en-NG" ? "NGN" : "GBP",
  });

  return formatter.format(number).split(".00")[0];
};
