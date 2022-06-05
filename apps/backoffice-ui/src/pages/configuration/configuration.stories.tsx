import { Story, Meta } from '@storybook/react';
import { Configuration } from './configuration';

export default {
  component: Configuration,
} as Meta;

const Template: Story = (args) => <Configuration {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
