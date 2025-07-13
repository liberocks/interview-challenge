import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

 

const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "subheading1",
        "body1",
        "body1-sb",
        "button-text",
        "mobile-h1",
        "mobile-h2",
        "mobile-h3",
        "mobile-h4",
        "mobile-h5",
        "mobile-h6",
        "mobile-subheading1",
        "mobile-body1",
        "mobile-body1-sb",
        "mobile-button-text",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
