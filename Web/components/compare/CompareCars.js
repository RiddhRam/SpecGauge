import { Pressable, View, Text, ScrollView } from "react-native-web";
import { SGStyles } from "../../../styles/styles";
import { v4 as uuidv4 } from "uuid";
import SelectionModalCars from "../SelectionModalCars";

import { useState } from "react";

export default function CompareCars({
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
  CloudFunctionModels,
  CloudFunctionYears,
  CloudFunctionTrims,
  CloudFunctionTrimView,
  preRequestedSpecs,
  amplitude,
}) {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const styles = SGStyles();

  {
    /* Everything is the same as the Compare screen, except for the fact that it uses
   SelectionModalCars */
  }

  return (
    <View style={styles.containerStyles.comparisonScreenContainer}>
      <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
        {type} Comparison
      </Text>

      <View style={{ marginRight: "auto", flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            {
              /* Set page to home */
            }
            setCategory(0);

            {
              /* Reset row heights and remove all specs */
            }
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
            {
              /* Show product selection modal */
            }
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
        {/* For each item in spec, show a column */}
        {Specs.map((item, index1) => (
          <View
            key={uuidv4() + item}
            style={[styles.containerStyles.comparisonColumns]}
          >
            {/* If it's not the first column (the category labels), then show a remove button */}
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
                  {
                    /* Remove item */
                  }
                  newArray = Specs.filter(
                    (subArray) => Specs[index1] !== subArray
                  );
                  await setSpecs(newArray);
                  {
                    /* Specs won't be updated yet even though we used setSpecs, so the length is still 2 */
                  }
                  {
                    /* If the length is 2 then 1 is removed, then there is 1 item left, which is the category labels */
                  }
                  {
                    /* Category labels default height is 39 */
                  }
                  if (Specs.length == 2) {
                    for (let i = 0; i < SetHeight.length; i++) {
                      SetHeight[i](39);
                    }
                  } else {
                    {
                      /* Calculate new height if 1 or more specs are left */
                    }
                    for (let i = 1; i < Specs.length; i++) {
                      /* We loop through each column*/
                      for (let j = 0; j < Specs[i].length; j++) {
                        /* We loop through row in each column */
                        let counter = 0;
                        let position = 0;
                        while (true) {
                          {
                            /* Height is determined by (number of '\n' - 1) * 17 + 39 */
                            /* We count the number of \n in each column */
                          }
                          position = Specs[i][j].indexOf("\n", position);
                          if (position == -1) {
                            break;
                          }
                          counter++;
                          position += 1;
                        }
                        {
                          /* Since an item was removed, the height can only be the same or smaller */
                          /* We check if old height is greater then new height, then change it, or else leave it  */
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
                /* We loop through each row in each column */
                <Text
                  key={uuidv4() + spec}
                  /* the category labels have a special blue background so they have a different style, specCategoryText */
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
                      {
                        /* Height is determined by (number of '\n' - 1) * 17 + 39 */
                        /* We count the number of \n in each column */
                      }
                      position = spec.indexOf("\n", position);
                      if (position == -1) {
                        break;
                      }
                      counter++;
                      position += 1;
                    }

                    {
                      /* Since an item was added, the height can only be the same or larger */
                      /* We check if old height is less then new height, then change it, or else leave it  */
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

      <SelectionModalCars
        type={type}
        productModalVisible={productModalVisible}
        setProductModalVisible={setProductModalVisible}
        brands={Brands}
        cloudFunctionModels={CloudFunctionModels}
        cloudFunctionYears={CloudFunctionYears}
        cloudFunctionTrims={CloudFunctionTrims}
        cloudFunctionTrimView={CloudFunctionTrimView}
        process={Process}
        setSpecs={setSpecs}
        matchingArray={MatchingArray}
        defaultArray={DefaultArray}
        categories={Categories}
        amplitude={amplitude}
      ></SelectionModalCars>
    </View>
  );
}
