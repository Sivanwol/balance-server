import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="loader">
      <Center>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Center>
    </div>
  );
};
