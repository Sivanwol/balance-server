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
import { Loader } from '@balancer/backoffice-common';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";
interface Props {
  children: any;
}

const IntroLayout: FC<Props> = ({ children, ...props }) => {
  const {  isLoading , isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  if (isAuthenticated) {
    navigate("/overview", { replace: true });
  }
  return (
    <VStack align="stretch">
      <Flex color="white">
        <Box w="100%">
          <Flex minWidth="max-content" alignItems="center" gap="2">
            <Box p="4">
              <Link href="https://chakra-ui.com" isExternal>
                <Image boxSize="100px" objectFit="cover" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
              </Link>
            </Box>
          </Flex>
          <Container {...props}>{isLoading? <Loader />: children} </Container>
        </Box>
      </Flex>
    </VStack>
  );
};

export default IntroLayout;
