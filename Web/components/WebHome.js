import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import {
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native-web";
import { useState } from "react";

import { httpsCallable } from "firebase/functions";

import { v4 as uuidv4 } from "uuid";

const categories = [
  "Automobiles",
  "Phones",
  "Consoles",
  "Drones",
  "Graphics Cards",
  "Processors",
];

const processes = [
  ["a brand", "a model", "a trim", "a year"],
  ["a brand", "a phone"],
  ["a brand", "a console"],
  ["a brand", "a drone"],
  ["a brand", "a generation", "a graphics card"],
  ["a brand", "a generation", "a processor"],
];

const brands = [
  ["Audi", "Dodge", "Ford"],
  ["Apple", "Samsung"],
  [
    "Microsoft",
    "Nintendo",
    "Sony",
    "Abxylute",
    "Alienware",
    "Analogue",
    "Anbernic",
    "Aokzoe",
    "ASUS",
    "Atari",
    "Aya",
    "Ayn",
    "GPD",
    "KTPocket",
    "Lenovo",
    "Logitech",
    "MSI",
    "Onexplayer",
    "Powerkiddy",
    "Retroid",
    "Terrans",
    "Valve",
  ],
  ["Autel", "DJI", "Holy Stone", "Parrot", "Potensic", "Ryze", "Snaptain"],
  ["AMD", "Intel", "NVIDIA"],
  ["AMD", "Intel"],
];

const ridiculous = [
  "supercalifragilisticexpialidocious",
  "antidisestablishmentarianism",
  "pseudopseudohypoparathyroidism",
  "floccinaucinihilipilification",
  "pneumonoultramicroscopicsilicovolcanoconiosis",
  "hippopotomonstrosesquippedaliophobia",
  "electroencephalographically",
  "immunoelectrophoretically",
  "hepatolenticular degeneration",
  "hypercholesterolemia",
  "supernaturalism",
  "institutionalization",
  "microspectrophotometrically",
  "revascularization",
  "anthropomorphologically",
  "parthenogenetically",
  "psychopharmacological",
  "immunosuppressiveness",
  "incomprehensibilities",
  "uncharacteristically",
  "incomprehensibleness",
  "pharmacodynamically",
  "representationalism",
  "uncontrollableness",
  "uncompromisingness",
  "constitutionalization",
  "photodisintegrations",
  "irreconcilabilities",
  "overrepresentations",
  "nonprofessionally",
  "undeniableness",
  "inconsiderableness",
  "incontrovertibility",
  "unconventionality",
  "transistorizations",
  "interrelationships",
  "counterinfluences",
  "interconvertibility",
  "unpretentiousnesses",
  "irreplaceabilities",
  "noncontroversially",
  "counterreformations",
  "indiscriminateness",
  "transubstantiations",
  "irresponsibilities",
  "counteradaptations",
  "incontrovertibility",
  "unconventionality",
  "transistorizations",
  "interrelationships",
  "counterinfluences",
  "interconvertibility",
  "unpretentiousnesses",
  "irreplaceabilities",
  "noncontroversially",
  "counterreformations",
  "indiscriminateness",
  "transubstantiations",
  "irresponsibilities",
  "counteradaptations",
  "electroencephalogram",
  "antiestablishmentarian",
  "unconstitutionality",
  "counterdemonstration",
  "microencapsulations",
  "indiscriminately",
  "hyperconsciousnesses",
  "counterproliferation",
  "representativenesses",
  "counterconspiratorial",
  "electrocardiographic",
  "uncharacteristically",
  "immunoprecipitations",
  "incomprehensibility",
  "uncontrollabilities",
  "pharmacologically",
  "immunohistochemical",
  "interchangeabilities",
  "uncontrollabilities",
  "disenfranchisements",
  "neurotransmissions",
  "antiestablishmentarianism",
  "interchangeabilities",
  "disproportionateness",
  "antiestablishmentarian",
  "hyperconsciousness",
  "counterproliferation",
  "representativeness",
  "counterconspiratorial",
  "electrocardiographic",
  "uncharacteristically",
  "immunoprecipitation",
  "incomprehensibility",
  "uncontrollability",
  "pharmacological",
  "immunohistochemical",
  "interchangeability",
  "uncontrollability",
  "disenfranchisement",
  "neurotransmission",
  "antiestablishment",
  "disproportionateness",
  "antiestablishment",
  "disproportionate",
  "antiestablishment",
  "disproportionate",
  "antiestablishment",
  "disproportionate",
];

export default function WebHome({ userVal, functions }) {
  {
    /* This is for the modal that determines the comparison type */
  }
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  {
    /* Determines what comparison screen to show */
  }
  const [category, setCategory] = useState(4);

  {
    /* Determines which part of product selection the modal is on */
  }
  const [modalScreen, setModalScreen] = useState(0);

  const [droneSpecs, setDroneSpecs] = useState([
    ["Brand", "Name", "Specs1", "Specs2", "Specs3", "Specs4", "Specs5"],
  ]);

  // Call SGStyles as styles
  const styles = SGStyles();

  const { height, width } = useWindowDimensions();

  const callDroneCloudFunction = async (product) => {
    try {
      const GetDrones = httpsCallable(functions, "GetDrones");
      const result = await GetDrones(product);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar page={"home"} userVal={userVal} />

      {/* main body */}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Selection comparison type, default screen */}
        {category == 0 && (
          <View style={styles.containerStyles.largeContainer}>
            <View>
              <Pressable
                onPress={() => {
                  setCompareModalVisible(true);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                ]}
              >
                <p>Compare</p>
              </Pressable>

              <Modal
                visible={compareModalVisible}
                animationType="slide"
                transparent="true"
              >
                <View style={styles.containerStyles.modalContainer}>
                  <Text style={styles.textStyles.text}>Select a category</Text>

                  <ScrollView style={styles.textStyles.modalText}>
                    {categories.map((item, index) => (
                      <Pressable
                        style={({ pressed }) => [
                          { padding: 10, paddingRight: 50, fontSize: 20 },
                          pressed &&
                            styles.inputStyles.buttonNoBackgroundClicked,
                        ]}
                        key={item}
                        onPress={() => {
                          {
                            /* It needs to be incremented because index is 0 indexed, but the values in the if statement isn't */
                          }
                          setCategory(index + 1);
                          setCompareModalVisible(false);
                        }}
                      >
                        <p>{item}</p>
                      </Pressable>
                    ))}
                  </ScrollView>

                  <Pressable
                    onPress={() => {
                      setCompareModalVisible(false);
                      setModalScreen(0);
                    }}
                    style={({ pressed }) => [
                      styles.inputStyles.button,
                      pressed && styles.inputStyles.buttonClicked,
                    ]}
                  >
                    <p>Cancel</p>
                  </Pressable>
                </View>
              </Modal>
            </View>
          </View>
        )}

        {/* Compare Drones screen */}
        {category == 4 && (
          <View style={styles.containerStyles.comparisonScreenContainer}>
            <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
              Drones Comparison
            </Text>

            <View style={{ marginRight: "auto", flexDirection: "row" }}>
              <Pressable
                onPress={() => {
                  setCategory(0);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                ]}
              >
                <p>{"< Go Back"}</p>
              </Pressable>

              <Pressable
                onPress={async () => {
                  const newArray = [];
                  const length = droneSpecs[0].length;
                  for (let i = 0; i < length; i++) {
                    const randInt = Math.floor(Math.random() * 100);
                    const randomElement = ridiculous[randInt];
                    console.log(randomElement);
                    newArray.push(randomElement);
                  }
                  await setDroneSpecs((prevSpecs) => [...prevSpecs, newArray]);
                  console.log(droneSpecs);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                ]}
              >
                <p>Add</p>
              </Pressable>
            </View>

            <ScrollView
              horizontal={true}
              style={styles.containerStyles.comparisonScreenContainer}
            >
              {droneSpecs.map((item, index1) => (
                <View
                  key={uuidv4() + item}
                  style={[styles.containerStyles.comparisonColumns]}
                >
                  {item.map((spec, index2) => (
                    <Text
                      key={uuidv4() + spec}
                      style={
                        index1 == 0
                          ? styles.textStyles.specCategoryText
                          : styles.textStyles.comparisonText
                      }
                    >
                      {spec}
                    </Text>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
