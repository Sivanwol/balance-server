import { gql } from '@apollo/client';

export const ClientSideConfigurationQuery = gql`
  query getSiteSettings {
    siteSettings {
      key
      value
    }
  }
`;

export const PlatformConfigurationQuery = gql`
  query getPlatformSettings {
    platformSettings {
      key
      value
      service
      isEnabled
      isClientSide
    }
  }
`;
