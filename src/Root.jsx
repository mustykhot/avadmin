import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./component/ScrollToTop";
import Account from "./pages/admin/Dashboard/Account";
import Administrator from "./pages/admin/Dashboard/Administrators";
import Ads from "./pages/admin/Dashboard/Ads";
import Auction from "./pages/admin/Dashboard/Auction";
import AuctionDetail from "./pages/admin/Dashboard/Auction/auction_detail";
import Audit from "./pages/admin/Dashboard/Audit";
import Category from "./pages/admin/Dashboard/Category";
import Chat from "./pages/admin/Dashboard/Chat";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Plan from "./pages/admin/Dashboard/plan";
import PrivateDeal from "./pages/admin/Dashboard/PrivateDeal";
import PrivateDealForm1 from "./pages/admin/Dashboard/PrivateDeal/form1";
import CreatePrivateDeal from "./pages/admin/Dashboard/PrivateDeal/SellItem";

import PrivateVendor from "./pages/admin/Dashboard/PrivateVendor";
import Shipping from "./pages/admin/Dashboard/Shipping";
import ShippingDetail from "./pages/admin/Dashboard/Shipping/shipping_detail";

import Transaction from "./pages/admin/Dashboard/Transaction";
import TransactionDetail from "./pages/admin/Dashboard/Transaction/transaction_detail";
import TransactionDownload from "./pages/admin/Dashboard/Transaction/transaction_download";
import Users from "./pages/admin/Dashboard/Users";
import UsersProfile from "./pages/admin/Dashboard/UsersProfile";
import Login from "./pages/admin/Login";
import LoginNormal from "./pages/admin/Login/login";
import Reset from "./pages/admin/ResetPassword/reset";
import SetPassword from "./pages/admin/ResetPassword/setPassword";
const Root = () => {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <>
          <ScrollToTop />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Administrator />} />
            <Route path="/category" element={<Category />} />
            <Route path="/users" element={<Users />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/account" element={<Account />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/private" element={<PrivateDeal />} />
            <Route path="/private-vendor" element={<PrivateVendor />} />
            <Route path="/private/form1" element={<CreatePrivateDeal />} />
            <Route
              path="/users/user_detail/:id"
              element={<UsersProfile />}
            />{" "}
            <Route path="/transaction" element={<Transaction />} />
            <Route
              path="/transaction/details/:id"
              element={<TransactionDownload />}
            />
            <Route path="/auction" element={<Auction />} />
            <Route
              path="/auction/auction_detail/:id"
              element={<AuctionDetail />}
            />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/shipping/:id" element={<ShippingDetail />} />
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<LoginNormal />} />
            <Route path="/forget" element={<Reset />} />
            <Route path="/set_password" element={<SetPassword />} />
          </Routes>
        </>
      </BrowserRouter>
    </div>
  );
};

export default Root;
