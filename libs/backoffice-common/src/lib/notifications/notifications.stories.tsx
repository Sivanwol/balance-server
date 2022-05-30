import { Story, Meta } from '@storybook/react';
import { Notifications, NotificationsProps as NotificationsProps } from './notifications';

export default {
  component: Notifications,
  title: 'Notifications',
} as Meta;

const Template: Story<NotificationsProps> = (args) => <Notifications {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
