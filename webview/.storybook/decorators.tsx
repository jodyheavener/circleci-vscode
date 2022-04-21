export const StoryBase = (Story, context) => {
  document.querySelector("html").dataset.theme = context.globals.theme;
  return Story();
};
