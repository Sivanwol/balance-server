import React, { FC } from 'react';
import {
  Link,
  Image,
  Box,
  Container,
  VStack,
  Flex,
  Center,
} from '@chakra-ui/react';
interface Props {
  children: any;
}

const IntroLayout: FC<Props> = ({ children, ...props }) => {
  return (
    <VStack align="stretch">
      <Flex color="white">
        <Box w="75px" bg="green.500">
          <Center marginTop="1em">
            &nbsp;
          </Center>
        </Box>
        <Box w="100%">
          <Flex minWidth="max-content" alignItems="center" gap="2">
            <Box p="4">
              <Link href="https://chakra-ui.com" isExternal>
                <Image boxSize="100px" objectFit="cover" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
              </Link>
            </Box>
          </Flex>
          <Container {...props}>{children} </Container>
        </Box>
      </Flex>
    </VStack>
  );
};

export default IntroLayout;
