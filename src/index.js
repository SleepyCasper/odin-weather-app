import "./styles/styles.css";
import { Init } from "./init";
import { EventHandler } from "./eventHandler";
import "dragscroll";

Init();
document.addEventListener("DOMContentLoaded", () => {
    EventHandler.init();
});

