import React from 'react';
import styles from './notifictions.module.styl';
import { RiMailLine } from 'react-icons/ri';
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Icon,
  Text,
  List,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
  Divider,
  Center,
} from '@chakra-ui/react';
/* eslint-disable-next-line */
export interface NotifictionsProps {}
const notificationItemMock = (idx: number): React.ReactElement => (
  <ListItem _hover={{ background: 'gray.500' }} key={idx}>
    <Grid h="100px" templateColumns="repeat(5, 1fr)" gap={2}>
      <GridItem rowSpan={2} colSpan={1}>
        <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
      </GridItem>
      <GridItem colSpan={4} alignItems="middle">
        <Text fontWeight="bold" display="inline" paddingRight={15}>
          Name Name
        </Text>
        <Text display="inline" paddingLeft="15">
          14 hours age
        </Text>
      </GridItem>
      <GridItem colSpan={4}>Lorem ipsum dolor sit amet, consectetur adipisicing elit</GridItem>
    </Grid>
  </ListItem>
);
const addNewNotificationMock = (): React.ReactElement => {
  const rows = [];
  for (let i = 0; i < 5; i++) {
    rows.push(notificationItemMock(i));
  }
  return (
    <Box>
      <List spacing={3}>{rows}</List>
    </Box>
  );
};
export function Notifictions(props: NotifictionsProps) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);
  return (
    <div className={styles['container']}>
      <Popover
        isLazy
        isOpen={isOpen}
        closeOnBlur={true}
        closeOnEsc={true}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        preventOverflow={false}
        placement="bottom"
      >
        <PopoverTrigger>
          <Avatar size="sm" icon={<Icon as={RiMailLine} />}>
            <AvatarBadge boxSize="1em" bg="red.500" />
          </Avatar>
        </PopoverTrigger>
        <PopoverContent p={5} w="450px">
          <PopoverHeader fontWeight="semibold">
            <Center>Notifications</Center>
          </PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>{addNewNotificationMock()}</PopoverBody>
          <PopoverFooter display="flex" justifyContent="flex-end">
            <ButtonGroup size="sm">
              <Button variant="outline">Mark as Read</Button>
              <Button colorScheme="gray">View All</Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Notifictions;
