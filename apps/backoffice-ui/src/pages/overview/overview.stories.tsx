import { Story, Meta } from '@storybook/react';
import { Overview } from './overview';

export default {
  component: Overview,
  title: 'overview page',
} as Meta;

const Template: Story = (args) => <Overview title={''} {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
