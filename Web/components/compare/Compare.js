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
  amplitude,
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
            amplitude.track("Go Back");
            setCategory(0);

            for (let i = 0; i < SetHeight.length; i++) {
              SetHeight[i](39);
            }
            setSpecs(Categories);
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
            amplitude.track("Add Item");
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
            {index1 != 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.inputStyles.removeButton,
                  pressed && styles.inputStyles.removeButtonClicked,
                ]}
                onPress={async () => {
                  amplitude.track("Remove", {
                    Removed: Specs[index1],
                    Category: type,
                  });
                  newArray = Specs.filter(
                    (subArray) => Specs[index1] !== subArray
                  );
                  await setSpecs(newArray);
                  if (Specs.length == 2) {
                    for (let i = 0; i < SetHeight.length; i++) {
                      SetHeight[i](39);
                    }
                  } else {
                    for (let i = 1; i < Specs.length; i++) {
                      for (let j = 0; j < Specs[i].length; j++) {
                        let counter = 0;
                        let position = 0;
                        while (true) {
                          position = Specs[i][j].indexOf("\n", position);
                          if (position == -1) {
                            break;
                          }
                          counter++;
                          position += 1;
                        }
                        for (let k = 0; k < Height.length; k++) {
                          const newHeight = (counter - 1) * 17 + 39;
                          if (Height[k] > newHeight) {
                            SetHeight[k](newHeight);
                          }
                        }
                      }
                    }
                  }
                }}
              >
                <p>Remove</p>
              </Pressable>
            )}

            <View
              style={index1 == 0 ? { marginTop: 100 } : { marginTop: 26.5 }}
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
          </View>
        ))}
      </ScrollView>

      <SelectionModal
        type={type}
        productModalVisible={productModalVisible}
        setProductModalVisible={setProductModalVisible}
        brands={Brands}
        cloudFunction={CloudFunction}
        process={Process}
        setSpecs={setSpecs}
        matchingArray={MatchingArray}
        defaultArray={DefaultArray}
        categories={Categories}
        amplitude={amplitude}
      ></SelectionModal>
    </View>
  );
}
