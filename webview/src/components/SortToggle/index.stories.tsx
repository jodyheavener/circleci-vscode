import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import Component from ".";

export default {
  title: "SortToggle",
  component: Component,
} as ComponentMeta<typeof Component>;

type Story = ComponentStoryObj<typeof Component>;

export const Standard: Story = {
  args: {
    label: "Status",
    sortKey: "status",
  },
};
