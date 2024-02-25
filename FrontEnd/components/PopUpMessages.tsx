import { Alert } from "react-native";

// pass in the function and the text and it will create the pop up 

export const AreYouSure = (passedFunc, passedText) => {
  Alert.alert("Are you sure?", passedText, [
    {
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel",
    },
    { text: "Yes", onPress: passedFunc },
  ]);
};

export const OnSucess = (passedText) => {
  Alert.alert("Success", passedText, [
    { text: "OK", onPress: () => console.log("OK Pressed") },
  ]);
};

export const OnFailure = (passedText) => {
  Alert.alert("Failure", passedText, [
    { text: "OK", onPress: () => console.log("OK Pressed") },
  ]);
};
export const OnError = (passedText) => {
  Alert.alert("Error", passedText, [
    { text: "OK", onPress: () => console.log("OK Pressed") },
  ]);
};

export const OnWarning = (passedText) => {
  Alert.alert("Warning", passedText, [
    { text: "OK", onPress: () => console.log("OK Pressed") },
  ]);
};

export const OnInfo = (passedText) => {
  Alert.alert("Info", passedText, [
    { text: "OK", onPress: () => console.log("OK Pressed") },
  ]);
};
