import React from 'react';
import styles from './notifictions.module.styl';
import { RiMailLine } from 'react-icons/ri';
import {
  Avatar,
  AvatarBadge,
  Box,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
/* eslint-disable-next-line */
export interface NotifictionsProps {}
const addNewNotificationMock = (): React.ReactElement => {
  return <Box>test test</Box>;
};
export function Notifictions(props: NotifictionsProps) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);
  return (
    <div className={styles['container']}>
      <Popover isOpen={isOpen} initialFocusRef={firstFieldRef} onOpen={onOpen} onClose={onClose} placement="right" closeOnBlur={false}>
        <PopoverTrigger>
          <Avatar size="sm" icon={<Icon as={RiMailLine} />}>
            <AvatarBadge boxSize="1em" bg="red.500" />
          </Avatar>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>{addNewNotificationMock()}</PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Notifictions;
