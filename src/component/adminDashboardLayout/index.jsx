import "./style.scss";
import SideBar from "../SideBar";
import NavBar from "../NavBar";

const AdminDashboardLayout = ({ children, active }) => {
  return (
    <div className="dashLayout">
      <SideBar active={active} />
      <div className="mainBar">
        <NavBar />
        <div className="mainContent">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
