import "bootstrap/dist/css/bootstrap.css";
import { SGStyles } from "../styles/styles";

export default function WebApp() {
  const styles = SGStyles();
  return (
    <div style={styles.containerStyles.container}>
      <p style={styles.textStyles.text}>
        Open up App.js to start working on your app!
      </p>
    </div>
  );
}
