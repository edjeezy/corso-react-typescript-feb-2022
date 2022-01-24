import * as styles from "./Trip.css";
import * as models from "./models";
import { useNavigate } from "react-router";
import * as routes from "./routes";

type Props = models.Trip;

export function Trip(props: Props) {
  const navigate = useNavigate();
  return (
    <div
      className={styles.trip}
      onClick={() => navigate(routes.trip({ tripId: String(props.id) }))}
    >
      <span>{`${props.origin} -> ${props.destination}`}</span>
      <span>{`${props.startDate.toDateString()} -> ${props.endDate.toDateString()}`}</span>
    </div>
  );
}
