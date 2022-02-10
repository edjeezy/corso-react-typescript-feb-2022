import * as styles from "./MainLayout.css";
import { Outlet } from "react-router-dom";
import { useMatch } from "react-router";
import * as routes from "./routes";
import { useTranslation } from "./locales/i18n";

export function MainLayout() {
  const isTripView = useMatch(routes.trip.pattern);
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.mainLayout}>
      <header className={styles.header}>
        {isTripView ? t("MainLayout.TripDetails") : t("MainLayout.Trips")}
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.currentTarget.value)}
        >
          <option value="en">English</option>
          <option value="it">Italiano</option>
        </select>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
