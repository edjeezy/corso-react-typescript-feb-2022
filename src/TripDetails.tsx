import * as styles from "./TripDetails.css";
import { deleteTrip, getTrip, updateTripStatus } from "./api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router";
import { matchQuery } from "./util/matchQuery";
import { matchMutation } from "./util/matchMutation";
import * as routes from "./routes";
import { isoTranslate, useFormatDate, useTranslation } from "./locales/i18n";
import { Button } from "./Button";
import { Trip, TripStatus } from "./models";
import { Span } from "./designSystem/Span";

export function TripDetails() {
  const params = useParams<keyof routes.TripParams>();

  const tripId = params.tripId!;
  const tripQuery = useQuery(["trip", tripId], () => getTrip(tripId));

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteTripMutation = useMutation(deleteTrip, {
    onSuccess: () => {
      queryClient.invalidateQueries("trips");
      navigate(routes.trips.pattern);
    },
  });

  const updateTripStatusMutation = useMutation(updateTripStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(["trip", tripId]);
    },
  });

  const { t } = useTranslation();
  const formatDate = useFormatDate();

  const renderStatusSelect = (trip: Trip) => (
    <select
      value={trip.status}
      onChange={(e) =>
        updateTripStatusMutation.mutate({
          id: trip.id,
          newStatus: e.currentTarget.value as TripStatus,
        })
      }
    >
      <option value="Requested">{t("TripStatus.Requested")}</option>
      <option value="Booked">{t("TripStatus.Booked")}</option>
      <option value="CheckedIn">{t("TripStatus.CheckedIn")}</option>
    </select>
  );

  return (
    <div className={styles.tripDetails}>
      {matchQuery(tripQuery, {
        error: () => <div>{t("TripDetails.QueryError", { tripId })}</div>,
        loading: () => <div>{t("TripDetails.QueryLoading")}</div>,
        success: (trip, isFetching) => (
          <>
            <div className={styles.tripBox[trip.status]}>
              <Span>{t("TripDetails.From")}</Span>
              <Span>{isoTranslate(trip.origin)}</Span>
              <Span>{formatDate(trip.startDate)}</Span>
            </div>
            <div className={styles.tripBox[trip.status]}>
              <Span>{t("TripDetails.To")}</Span>
              <Span>{isoTranslate(trip.destination)}</Span>
              <Span>{formatDate(trip.endDate)}</Span>
            </div>
            <div className={styles.footer}>
              {matchMutation(updateTripStatusMutation, {
                idle: () => renderStatusSelect(trip),
                success: () =>
                  isFetching
                    ? t("TripDetails.UpdateStatusLoading")
                    : renderStatusSelect(trip),
                error: () => renderStatusSelect(trip),
                loading: () => t("TripDetails.UpdateStatusLoading"),
              })}
              <Button
                onClick={() => {
                  deleteTripMutation.mutate(tripId);
                }}
                status={deleteTripMutation.status}
                content={matchMutation(deleteTripMutation, {
                  idle: () => t("TripDetails.Delete"),
                  success: () => "", // This never happens because of redirect to /trips
                  error: () => t("TripDetails.DeleteError"),
                  loading: () => t("TripDetails.Delete"),
                })}
              />
            </div>
          </>
        ),
      })}
    </div>
  );
}
