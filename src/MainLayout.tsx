import * as styles from "./MainLayout.css";
import { Outlet } from "react-router-dom";
import { useMatch } from "react-router";

export function MainLayout() {
  const isTripView = useMatch("/trips/:tripId");

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
