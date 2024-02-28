import { Alert } from "react-native";

// pass in the function and the text and it will create the pop up 

export const AreYouSure = (passedFunc, passedText) => {
  Alert.alert("Are you sure?", passedText, [
    {
      text: "Cancel",
      style: "cancel",
    },
    { text: "Yes", onPress: passedFunc },
  ]);
};

export const OnSucess = (passedText) => {
  Alert.alert("Success", passedText, [
  ]);
};

export const OnFailure = (passedText) => {
  Alert.alert("Failure", passedText, [
  ]);
};
export const OnError = (passedText) => {
  Alert.alert("Error", passedText, [
  ]);
};

export const OnWarning = (passedText) => {
  Alert.alert("Warning", passedText, [
  ]);
};

export const OnInfo = (passedText) => {
  Alert.alert("Info", passedText, [
  ]);
};
