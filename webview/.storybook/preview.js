import { StoryBase } from "./decorators";
import "./theme.css";

export const parameters = {
  layout: "fullscreen",
};

export const decorators = [StoryBase];

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Set the dark/light theme of the story",
    defaultValue: "light",
    toolbar: {
      icon: "eye",
      items: [
        {
          value: "light",
          right: "🌞",
          title: "Light",
        },
        {
          value: "dark",
          right: "🌜",
          title: "Dark",
        },
      ],
    },
  },
};
