import {exportView} from "react-coat-pkg";
import model from "../model";
import "./index.less";
import MainComponent from "./Main";

export const Main = exportView(MainComponent, model);