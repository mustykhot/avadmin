import { Skeleton } from "@mui/material";
import "./style.scss";
const LoadingTable = () => {
  return (
    <table className="skeletonTable">
      <thead>
        <tr>
          <th>
            {" "}
            <Skeleton animation="wave" width="100%" height={20} />
          </th>
          <th>
            {" "}
            <Skeleton animation="wave" width="100%" height={20} />
          </th>
          <th className="extraTh">
            {" "}
            <Skeleton animation="wave" width="100%" height={20} />
          </th>
          <th className="extraTh">
            <Skeleton animation="wave" width="100%" height={20} />
          </th>
          <th className="extraTh">
            <Skeleton animation="wave" width="100%" height={20} />
          </th>
          <th>
            <Skeleton animation="wave" width="100%" height={20} />
          </th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4, 5, 6].map((item) => {
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
