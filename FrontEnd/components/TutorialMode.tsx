import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import Search from "../app/(tabs)/Search";
import { transform } from "@babel/core";
import axios from "axios";

const TutorialSteps = forwardRef(
  (
    { visible, pageContext }: { visible: boolean; pageContext: string },
    ref
  ) => {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(0);
    const joined_com = useSelector((state: any) => state.user.me.joined_com);
    const url = useSelector((state: any) => state.user.url);

    const contentByPage = useMemo(() => {
      const baseContent = {
        camera: {
          titles: ["Welcome to Achevio!", "Join a Community"],
          steps: [
            "Let's Turn one day into day one!",
            "Press on the Search Icon to Search for communities",
          ],
        },
        search: {
          titles: ["Choose any community to join!"],
          steps: [
            "These are the communities you can join, add more friends to see more communities!",
          ],
        },
        communityPage: {
          titles: [
            joined_com
              ? "Lets walk you around the community"
              : "Community Page",
            joined_com ? "Try the Leaderboard!" : "Let's join it!",
            joined_com ? "Limited time events" : null,
            joined_com ? "You are all set!" : null,
          ],
          steps: joined_com
            ? [
                "Try to press on Posts to maximize them!",
                "It is a great way to see the community's activity and add little competition between memebers!",
                "If the community supports it, you can see the limited time events here!",
                "Enjoy The app and stay updated for new features!"
              ]
            : [
                "This is the community page, you can see the posts and members of the community here.",
                "Press on the three dots to toggle the menu and join the community!",
                null,
                null,
              ],
        },
        community: {
          titles: ["This is the community home page", "Let's check them out!"],
          steps: [
            "Where you can check out your joined communities!",
            "Press on the community to see the posts and members",
          ],
        },
      };

      return baseContent;
    }, [joined_com]);

    // Get content based on the current page context
    const { titles, steps } = contentByPage[pageContext] || {
      titles: [],
      steps: [],
    };
    useEffect(() => {
      console.log("Current Step: ", currentStep);
      console.log(
        "should it return ",
        allowedStepsCommunityPage.has(currentStep) &&
          pageContext === "communityPage"
      );
      console.log("pageContext: ", pageContext);
      console.log("arrow style ", getStyleForPage(pageContext));
    }, [currentStep]);

    const onNext = () => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1); // Move to next step
      } 
      if (joined_com && currentStep === 3) {
        dispatch({
          type: "SET_DONE_TUTORIAL",
          payload: { done_tutorial: true },
        });
        const res = axios.post(`${url}/user/doneTutorial`);
        console.log("res: ", res);
        

      }
    };
    // Define animations based on page context
    const animations = useMemo(
      () => ({
        camera: require("../assets/images/arrow.json"),
        community: require("../assets/images/arrowUp.json"),
        search: require("../assets/images/arrow.json"),
        communityPage: require("../assets/images/arrowUp.json"),
      }),
      []
    );

    const currentAnimation = animations[pageContext];
    useImperativeHandle(ref, () => ({
      completeTutorial: () => {
        dispatch({
          type: "SET_DONE_TUTORIAL",
          payload: { done_tutorial: true },
        });
        console.log("Tutorial Completed");
        // You can add more logic here if needed
      },
      nextStep: () => {
        if (currentStep < contentByPage[pageContext].steps.length) {
          setCurrentStep(currentStep + 1);
        }
      }
      
    }));

    const allowedStepsCamera = new Set([1]);
    const allowedStepsCommunityPage = new Set([0, 1]);
    const allowedStepsCommunity = new Set([2]);
    const allowedStepsComBase = new Set([0, 1, 2, 3]);

    function getStyleForPage(pageContext: string) {
      switch (pageContext) {
        case "camera":
          return {
            width: 100,
            height: 100,
            bottom: -4,
            left: 24,
            zIndex: 1001,
          };
        case "communityPage":
          return {
            width: 100,
            height: 100,
            top: 20,
            right: -2,
            zIndex: 1000,
          };

        case "community":
          return {
            width: 100,
            height: 100,
            top: 90,
            left: 20,
            zIndex: 1000,
          };

        default:
          return {};
      }
    }
    return (
      <>
        {visible &&
          !(
            (currentStep === 1 && pageContext === "search") ||
            (currentStep === 2 && pageContext === "community") ||
            (currentStep === 4 && pageContext === "communityPage" && joined_com) ||
            (currentStep === 2 && pageContext === "communityPage" && !joined_com)
          ) && (
            <View style={styles.overlay} pointerEvents="auto">
              <Text style={styles.header}>{titles[currentStep]}</Text>
              <Text style={styles.instruction}>{steps[currentStep]}</Text>
              {((!allowedStepsCamera.has(currentStep) &&
                (pageContext === "camera" || pageContext === "search")) ||
                (!allowedStepsCommunity.has(currentStep) &&
                  pageContext === "community") ||
                (allowedStepsCommunityPage.has(currentStep) &&
                  pageContext === "communityPage") ||
                (allowedStepsComBase.has(currentStep) &&
                  pageContext === "communityPage" &&
                  joined_com)) && (
                <TouchableOpacity style={styles.button} onPress={onNext}>
                  <Text style={styles.buttonText}>
                    {currentStep < 3 ? "Next" : "Finish"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        {((allowedStepsCamera.has(currentStep) && pageContext === "camera") ||
          (allowedStepsCommunity.has(currentStep) &&
            pageContext === "community") ||
          (allowedStepsCommunityPage.has(currentStep) &&
            pageContext === "communityPage")) &&
          (console.log("arrow is on"),
          (
            <LottieView
              source={currentAnimation}
              autoPlay
              loop
              style={{ ...getStyleForPage(pageContext), position: "absolute" }}
            />
          ))}
      </>
    );
  }
);
// rgba(0,0,0,0.5)
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  header: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default TutorialSteps;
