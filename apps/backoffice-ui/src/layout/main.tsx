import React, { FC } from 'react';
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
} from '@chakra-ui/react';
interface Props {
  children: any;
}

const Layout: FC<Props> = ({ children, ...props }) => {
  return (
    <>
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
              <Avatar>
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              </Avatar>
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

      <VStack align="stretch">
        <Flex color="white">
          <Box w="200px" bg="green.500">
            <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4}>
              <Accordion defaultIndex={[0]} allowMultiple>
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
          </Box>
          <Box>
            <Container {...props}>{children} </Container>
          </Box>
        </Flex>
      </VStack>
    </>
  );
};

export default Layout;
