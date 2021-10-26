import * as styles from "./MainLayout.css";

export function MainLayout() {
  return (
    <div className={styles.mainLayout}>
      <header className={styles.header}>Welcome!</header>
      <main className={styles.main}>
        <p>This is the main content.</p>
      </main>
    </div>
  );
}
