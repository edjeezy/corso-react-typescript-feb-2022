import * as styles from "./TripDetails.css";
import { deleteTrip, getTrip, updateTripStatus } from "./api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router";
import { matchQuery } from "./util/matchQuery";
import { matchMutation } from "./util/matchMutation";
import * as routes from "./routes";
import { useTranslation } from "react-i18next";
import { useFormatDate } from "./locales/i18n";
import { Button } from "./Button";
import { Trip, TripStatus } from "./models";
import { useState } from "react";

type State =
  | {
      state: "ready";
    }
  | {
      state: "confirmDelete";
    };

export function TripDetails() {
  const params = useParams<keyof routes.TripParams>();
  const [state, updateState] = useState<State>({ state: "ready" });

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

  const renderDelete = (): React.ReactNode => {
    switch (state.state) {
      case "ready":
        return (
          <Button
            onClick={() => updateState({ state: "confirmDelete" })}
            status="idle"
            content={t("TripDetails.Delete")}
          />
        );
      case "confirmDelete":
        return (
          <>
            <span>{t("TripDetails.DeleteConfirmMessage")}</span>
            <Button
              onClick={() => updateState({ state: "ready" })}
              status="idle"
              content={t("TripDetails.DeleteCancel")}
            />
            <Button
              onClick={() => {
                deleteTripMutation.mutate(tripId);
              }}
              status={deleteTripMutation.status}
              content={matchMutation(deleteTripMutation, {
                idle: () => t("TripDetails.DeleteConfirm"),
                success: () => "", // This never happens because of redirect to /trips
                error: () => t("TripDetails.DeleteError"),
                loading: () => t("TripDetails.Delete"),
              })}
            />
          </>
        );
    }
  };
  return (
    <div className={styles.tripDetails}>
      {matchQuery(tripQuery, {
        error: () => <div>{t("TripDetails.QueryError", { tripId })}</div>,
        loading: () => <div>{t("TripDetails.QueryLoading")}</div>,
        success: (trip, isFetching) => (
          <>
            <div className={styles.tripBox[trip.status]}>
              <span>{t("TripDetails.From")}</span>
              <span>{trip.origin}</span>
              <span>{formatDate(trip.startDate)}</span>
            </div>
            <div className={styles.tripBox[trip.status]}>
              <span>{t("TripDetails.To")}</span>
              <span>{trip.destination}</span>
              <span>{formatDate(trip.endDate)}</span>
            </div>
            <div className={styles.footer}>
              {state.state === "ready" &&
                matchMutation(updateTripStatusMutation, {
                  idle: () => renderStatusSelect(trip),
                  success: () =>
                    isFetching
                      ? t("TripDetails.UpdateStatusLoading")
                      : renderStatusSelect(trip),
                  error: () => renderStatusSelect(trip),
                  loading: () => t("TripDetails.UpdateStatusLoading"),
                })}
              {renderDelete()}
            </div>
          </>
        ),
      })}
    </div>
  );
}
