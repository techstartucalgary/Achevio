import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { SocialIcon } from "react-native-elements";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton() {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<any>(null);
  const redirectUri = Linking.createURL("/");
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "936305079160-l5l7ao7l492ik2q5o4oghlhho47ukbr2.apps.googleusercontent.com",
    iosClientId:
      "936305079160-57f2gdoajsr86j74rf4a7012cl6r0e4n.apps.googleusercontent.com",
    androidClientId:
      "936305079160-ab83cfppiao2407gcqslm6grmqumkui0.apps.googleusercontent.com",
  });
  React.useEffect(() => {
    const redirectUri = AuthSession.makeRedirectUri();
  }, []);
  React.useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken]);
  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userInfo = await response.json();
    setUser(userInfo);
  }

  return (
    <SocialIcon
      title="Sign In With Google"
      button
      type="google"
      style={{
        width: "60%",
      }}
      onPress={() => promptAsync()}
    />
  );
}
