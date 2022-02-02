import { Skeleton } from "@mui/material";
import "./style.scss";
const LoadingTable = ({ rows = [1, 2, 3, 4, 5, 6] }) => {
  return (
    <table className="skeletonTable">
      <thead>
        <tr>
          {rows.map((item) => {
            return (
              <th key={item}>
                {" "}
                <Skeleton animation="wave" width="100%" height={20} />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((item) => {
          return (
            <tr>
              <td className="">
                <Skeleton animation="wave" width="100%" height={20} />
              </td>
              <td className="phone">
                {" "}
                <Skeleton animation="wave" width="100%" height={20} />
              </td>
              <td className="collect">
                <Skeleton animation="wave" width="100%" height={20} />
              </td>
              <td className="phone">
                {" "}
                <Skeleton animation="wave" width="100%" height={20} />
              </td>
              <td className="statusTd">
                {" "}
                <Skeleton animation="wave" width="100%" height={20} />
              </td>
              <td className="action">
                <Skeleton animation="wave" width="100%" height={20} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LoadingTable;
