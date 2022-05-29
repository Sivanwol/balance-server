import { Story, Meta } from '@storybook/react';
import { Notifictions, NotifictionsProps } from './notifictions';

export default {
  component: Notifictions,
  title: 'Notifictions',
} as Meta;

const Template: Story<NotifictionsProps> = (args) => <Notifictions {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
