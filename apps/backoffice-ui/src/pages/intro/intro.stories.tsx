import { Story, Meta } from '@storybook/react';
import { Intro } from './intro';

export default {
  component: Intro,
  title: 'Intro Page',
} as Meta;

const Template: Story = (args) => <Intro {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
