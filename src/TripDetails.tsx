import * as styles from "./TripDetails.css";
import { getTrip } from "./api";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { matchQuery } from "./util/matchQuery";
import * as routes from "./routes";
import { useTranslation } from "react-i18next";

export function TripDetails() {
  const params = useParams<keyof routes.TripParams>();

  const tripId = params.tripId!;
  const tripQuery = useQuery(["trip", tripId], () => getTrip(tripId));

  const { t } = useTranslation();

  return (
    <div className={styles.tripDetails}>
      {matchQuery(tripQuery, {
        error: () => <div>{t("TripDetails.QueryError", { tripId })}</div>,
        loading: () => <div>{t("TripDetails.QueryLoading")}</div>,
        success: (trip) => (
          <>
            <div className={styles.from}>
              <span>{t("TripDetails.From")}</span>
              <span>{trip.origin}</span>
              <span>{trip.startDate.toDateString()}</span>
            </div>
            <div className={styles.to}>
              <span>{t("TripDetails.To")}</span>
              <span>{trip.destination}</span>
              <span>{trip.endDate.toDateString()}</span>
            </div>
          </>
        ),
      })}
    </div>
  );
}
