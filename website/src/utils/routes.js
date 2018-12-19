import HomeScreen from "../screens/HomeScreen";
import GettingStartedScreen from "../screens/GettingStartedScreen";
import DocumentationScreen from "../screens/DocumentationScreen";
import LoginScreen from "../screens/LoginScreen";
import AboutScreen from "../screens/AboutScreen";

export default [
  {
    path: "/",
    name: "Home",
    component: HomeScreen,
    exact: true,
    showMenu: true,
    icon: "home"
  },
  {
    path: "/getting-started",
    name: "Getting Started",
    component: GettingStartedScreen,
    exact: true,
    showMenu: true,
    icon: "play_arrow"
  },
  {
    path: "/documentation",
    name: "Documentation",
    component: DocumentationScreen,
    exact: true,
    showMenu: true,
    icon: "insert_drive_file"
  },
  {
    path: "/login",
    name: "Login",
    component: LoginScreen,
    exact: true,
    showMenu: false,
    icon: "input"
  },
  {
    path: "/about",
    name: "About us",
    component: AboutScreen,
    exact: true,
    showMenu: true,
    icon: "info"
  }
];
