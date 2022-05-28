import React, { FC } from 'react';
import { RiBuilding4Fill, RiBarChartHorizontalFill } from 'react-icons/ri';
import {
  Link,
  Avatar,
  AvatarBadge,
  Image,
  Box,
  Container,
  VStack,
  Flex,
  Spacer,
  Center,
  Menu,
  StackDivider,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  Icon,
} from '@chakra-ui/react';
interface Props {
  children: any;
}

const Layout: FC<Props> = ({ children, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <VStack align="stretch">
      <Flex color="white">
        <Box w="50px" bg="green.500">
          <Center marginTop="1em">
            <Icon as={RiBarChartHorizontalFill} onClick={onOpen} />
          </Center>
          <Spacer minH="4em" />
          <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4}>
            <Link href="https://chakra-ui.com" isExternal>
              <Icon as={RiBuilding4Fill} />
            </Link>
          </VStack>
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerCloseButton />
            <DrawerOverlay />
            <DrawerContent padding={4}>
              <Flex minWidth="max-content" alignItems="center" gap="2">
                <VStack w='100%' divider={<StackDivider borderColor="gray.200" />} spacing={4}>
                  <Accordion w='100%' defaultIndex={[0]}>
                    <AccordionItem w='100%'>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Icon as={RiBuilding4Fill} />
                            Category Title
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Link href="https://chakra-ui.com" isExternal>
                          <Text>Link</Text>
                        </Link>
                        <Link href="https://chakra-ui.com" isExternal>
                          <Text>Link</Text>
                        </Link>
                        <Link href="https://chakra-ui.com" isExternal>
                          <Text>Link</Text>
                        </Link>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            Category Title
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Link href="https://chakra-ui.com" isExternal>
                          <Text>Link</Text>
                        </Link>
                        <Link href="https://chakra-ui.com" isExternal>
                          <Text>Link</Text>
                        </Link>
                        <Link href="https://chakra-ui.com" isExternal>
                          <Text>Link</Text>
                        </Link>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            Category Title
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Link href="https://chakra-ui.com" isExternal>
                          <Text>Link</Text>
                        </Link>
                        <Link href="https://chakra-ui.com" isExternal>
                          <Text>Link</Text>
                        </Link>
                        <Link href="https://chakra-ui.com" isExternal>
                          <Text>Link</Text>
                        </Link>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </VStack>
              </Flex>
            </DrawerContent>
          </Drawer>
        </Box>
        <Box w="100%">
          <Flex minWidth="max-content" alignItems="center" gap="2">
            <Box p="4">
              <Link href="https://chakra-ui.com" isExternal>
                <Image boxSize="100px" objectFit="cover" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
              </Link>
            </Box>
            <Spacer />
            <Box p="4" gap="2">
              <Menu>
                <MenuButton>
                  <Flex>
                    <Avatar>
                      <AvatarBadge boxSize="1em" bg="green.500" />
                    </Avatar>
                    <Spacer />
                    <Center padding={3} flexWrap="nowrap">
                      <Text color="black">Sivan Wolberg</Text>
                    </Center>
                  </Flex>
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuItem>User Settings</MenuItem>
                    <MenuItem>Help</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
          <Container {...props}>{children} </Container>
        </Box>
      </Flex>
    </VStack>
  );
};

export default Layout;
