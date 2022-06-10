/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ApolloProvider, getApolloContext } from '@apollo/client';
import { useMemo } from 'react';
// @ts-ignore
export const CustomApolloProvider = ({ client, children }) => {
  const ApolloContext = getApolloContext();
  const value = useMemo(() => ({ client }), [client]);
  return <ApolloContext.Provider value={value}>{children}</ApolloContext.Provider>;
};
