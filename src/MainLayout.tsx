import * as styles from "./MainLayout.css";
import { Outlet } from "react-router-dom";
import { useMatch } from "react-router";
import * as routes from "./routes";
import { useTranslation } from "react-i18next";

export function MainLayout() {
  const isTripView = useMatch(routes.trip.pattern);
  const { t } = useTranslation();

  return (
    <div className={styles.mainLayout}>
      <header className={styles.header}>
        {isTripView ? t("MainLayout.TripDetails") : t("MainLayout.Trips")}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
