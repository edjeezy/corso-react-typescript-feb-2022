import * as styles from "./MainLayout.css";
import { Outlet } from "react-router-dom";
import { useMatch } from "react-router";
import * as routes from "./routes";

export function MainLayout() {
  const isTripView = useMatch(routes.trip.pattern);

  return (
    <div className={styles.mainLayout}>
      <header className={styles.header}>
        {isTripView ? "Trip Details" : "Trips"}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
