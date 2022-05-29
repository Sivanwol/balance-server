import React from 'react';
import styles from './notifictions.module.styl';
import { RiMailLine } from 'react-icons/ri';
import { Box, Icon, IconButton, Popover, PopoverArrow, PopoverCloseButton, PopoverContent, PopoverTrigger, useDisclosure } from '@chakra-ui/react';
/* eslint-disable-next-line */
export interface NotifictionsProps {}
const addNewNotificationMock = () => {
  return <Box>test test</Box>;
};
export function Notifictions(props: NotifictionsProps) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);
  return (
    <div className={styles['container']}>
      <Popover isOpen={isOpen} initialFocusRef={firstFieldRef} onOpen={onOpen} onClose={onClose} placement="right" closeOnBlur={false}>
        <PopoverTrigger>
          <IconButton size="sm" icon={<Icon as={RiMailLine} />} aria-label={''} />
        </PopoverTrigger>
        <PopoverContent p={5}>
          <PopoverArrow />
          <PopoverCloseButton />
          {{ addNewNotification(); }}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Notifictions;
