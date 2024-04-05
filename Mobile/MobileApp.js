import { StatusBar } from "expo-status-bar";

import { Text, View, useColorScheme } from "react-native";

import { SGStyles } from "../styles/styles";

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { ReactNativeAsyncStorage } from "firebase/auth"; // might need to be from @react-native-async-storage/async-storage
import * as firebaseFunctions from "firebase/functions";
import { collection, onSnapshot, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA10cNsdHKS-hVwScviUKrmcXbduduTFVA",
  authDomain: "specgauge-6226e.firebaseapp.com",
  // remember databseURL
  projectId: "specgauge-6226e",
  storageBucket: "specgauge-6226e.appspot.com",
  messagingSenderId: "497900705831",
  appId: "1:497900705831:web:632c2bfe74cb3f98ea9602",
  measurementId: "G-HERKE02P50",
};

const app = initializeApp(firebaseConfig);

export default function MobileApp() {
  /* This needs to be redeclared here so that in styles.js 
  it realizes it's a mobile app and it should look for the proper scheme
  for mobile devices, not browsers */
  const scheme = useColorScheme();

  // Call SGStyles function as styles
  const styles = SGStyles();

  return (
    <View style={styles.containerStyles.largeContainer}>
      <Text style={styles.textStyles.text}>
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
