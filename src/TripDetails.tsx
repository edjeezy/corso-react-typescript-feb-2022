import * as styles from "./TripDetails.css";
import { getTrip } from "./api";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { matchQuery } from "./util/matchQuery";

export function TripDetails() {
  const params = useParams<"tripId">();
  const tripId = params.tripId!;

  const tripQuery = useQuery(["trip", tripId], () => getTrip(tripId));

  return (
    <div className={styles.tripDetails}>
      {matchQuery(tripQuery, {
        error: () => <div>Error while fetching trips!!</div>,
        loading: () => <div>Loading...</div>,
        success: (trip) => (
          <>
            <div className={styles.from}>
              <span>From 🛫</span>
              <span>{trip.origin}</span>
              <span>{trip.startDate.toDateString()}</span>
            </div>
            <div className={styles.to}>
              <span>To 🛬</span>
              <span>{trip.destination}</span>
              <span>{trip.endDate.toDateString()}</span>
            </div>
          </>
        ),
      })}
    </div>
  );
}
