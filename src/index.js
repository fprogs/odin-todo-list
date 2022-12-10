/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
import "./style.css";
import { createHomepage } from "./homepage";

const homepage = createHomepage();
document.body.appendChild(homepage);
