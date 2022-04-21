import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import Component from ".";

export default {
  title: "Button",
  component: Component,
} as ComponentMeta<typeof Component>;

type Story = ComponentStoryObj<typeof Component>;

export const Button: Story = {
  args: {
    children: "Click me",
    onClick: () => {},
  },
};

export const Link: Story = {
  args: {
    children: "Click me",
    href: "https://www.google.com",
  },
};
