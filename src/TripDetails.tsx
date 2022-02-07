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
import { matchRender } from "./util/matchRender";

type ConfirmDialogState =
  | {
      status: "closed";
    }
  | {
      status: "open";
      message: string;
      onConfirm: () => void;
    };

export function TripDetails() {
  const [confirmDialogState, updateConfirmDialogState] =
    useState<ConfirmDialogState>({ status: "closed" });

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
                  updateConfirmDialogState({
                    status: "open",
                    message: t("TripDetails.ConfirmDeleteTrip", {
                      tripName: `"${trip.origin} - ${trip.destination}"`,
                    }),
                    onConfirm: () => deleteTripMutation.mutate(tripId),
                  });
                }}
                status="idle"
                content={matchMutation(deleteTripMutation, {
                  idle: () => t("TripDetails.Delete"),
                  success: () => "", // This never happens because of redirect to /trips
                  error: () => t("TripDetails.DeleteError"),
                  loading: () => t("TripDetails.Delete"),
                })}
              />
            </div>

            <div className={styles.dialogOverlay[confirmDialogState.status]}>
              {matchRender<
                ConfirmDialogState,
                ConfirmDialogState["status"],
                "status"
              >(confirmDialogState, confirmDialogState.status, {
                closed: () => null,
                open: (value) => (
                  <div className={styles.dialog}>
                    <h4>{value.message}</h4>

                    <div className={styles.dialogActions}>
                      <Button
                        content="Cancel"
                        status="idle"
                        onClick={() =>
                          updateConfirmDialogState({ status: "closed" })
                        }
                      />

                      {/* separator */}
                      <div style={{ width: 16 }} />

                      <Button
                        content="Confirm"
                        status={deleteTripMutation.status}
                        onClick={value.onConfirm}
                      />
                    </div>
                  </div>
                ),
              })}
            </div>
          </>
        ),
      })}
    </div>
  );
}
