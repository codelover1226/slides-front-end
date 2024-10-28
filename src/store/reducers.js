import { combineReducers } from "redux";
import Auth from "./Auth/reducer";
import Layout from "./Layout/reducer";
import Home from "../modules/home/store/reducer";
import Profile from "./Profile/reducer";
import Slidr from "../modules/slider/store/reducer";
import Subscription from "../modules/subscription/store/reducer";

const rootReducer = combineReducers({
  Auth,
  Layout,
  Home,
  Profile,
  Slidr,
  Subscription,
});

export default rootReducer;
