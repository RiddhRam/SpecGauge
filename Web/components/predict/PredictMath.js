import { Text, ScrollView, View } from "react-native-web";
import { SGStyles } from "../../../styles/styles";
import { Footer } from "../../Footer";

export default function PredictMath({ type, amplitude, isMobile }) {
  styles = SGStyles();
  return (
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      {/* Main Body */}
      <View style={styles.containerStyles.comparisonScreenContainer}>
        <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
          {type} Prediction
        </Text>
      </View>

      <Footer amplitude={amplitude} isMobile={isMobile} />
    </ScrollView>
  );
}
