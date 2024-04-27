import { Pressable, View, Text, ScrollView } from "react-native-web";
import { SGStyles } from "../../../styles/styles";
import { v4 as uuidv4 } from "uuid";
import SelectionModal from "../SelectionModal";

import { useState } from "react";

export default function Compare({
  type,
  setCategory,
  Brands,
  Process,
  MatchingArray,
  DefaultArray,
  Categories,
  Specs,
  setSpecs,
  Height,
  SetHeight,
  CloudFunction,
}) {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const styles = SGStyles();
  return (
    <View style={styles.containerStyles.comparisonScreenContainer}>
      <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
        {type} Comparison
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
            setProductModalVisible(true);
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
        {Specs.map((item, index1) => (
          <View
            key={uuidv4() + item}
            style={[styles.containerStyles.comparisonColumns]}
          >
            {item.map((spec, index2) => (
              <Text
                key={uuidv4() + spec}
                style={[
                  { height: Height[index2] },
                  index1 == 0
                    ? styles.textStyles.specCategoryText
                    : styles.textStyles.comparisonText,
                ]}
                onLayout={async () => {
                  let counter = 0;
                  let position = 0;

                  while (true) {
                    position = spec.indexOf("\n", position);
                    if (position == -1) {
                      break;
                    }
                    counter++;
                    position += 1;
                  }
                  const newHeight = (counter - 1) * 17 + 39;
                  if (Height[index2] < newHeight) {
                    SetHeight[index2](newHeight);
                  }
                }}
              >
                {spec}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>

      <SelectionModal
        productModalVisible={productModalVisible}
        setProductModalVisible={setProductModalVisible}
        brands={Brands}
        cloudFunction={CloudFunction}
        process={Process}
        setSpecs={setSpecs}
        matchingArray={MatchingArray}
        defaultArray={DefaultArray}
        categories={Categories}
      ></SelectionModal>
    </View>
  );
}
