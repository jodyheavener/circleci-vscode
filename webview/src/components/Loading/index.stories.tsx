import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import Component from ".";

export default {
  title: "Loading",
  component: Component,
} as ComponentMeta<typeof Component>;

type Story = ComponentStoryObj<typeof Component>;

export const Standard: Story = {};
