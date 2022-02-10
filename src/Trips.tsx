import { useQuery } from "react-query";
import { getTrips } from "./api";
import { useTranslation } from "./locales/i18n";
import { Trip } from "./Trip";
import * as styles from "./Trips.css";
import { matchQuery } from "./util/matchQuery";

export function Trips() {
  const tripsQuery = useQuery("trips", getTrips);
  const { t } = useTranslation();

  return (
    <div className={styles.trips}>
      {matchQuery(tripsQuery, {
        success: (trips, isFetching) =>
          isFetching
            ? t("TripDetails.QueryLoading")
            : trips.map((trip) => <Trip key={trip.id} {...trip} />),
        error: () => t("TripDetails.QueryError"),
        loading: () => t("TripDetails.QueryLoading"),
      })}
    </div>
  );
}
