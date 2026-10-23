import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function registerGSAP() {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

export function killScrollTriggers() {
  if (typeof window !== "undefined") {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
}

export function refreshScrollTrigger() {
  if (typeof window !== "undefined") {
    ScrollTrigger.refresh();
  }
}

export { gsap, ScrollTrigger };

