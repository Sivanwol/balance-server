import { gql } from "@apollo/client";

export const ClientSideConfigurationQuery = gql`
query getSiteSettings {
  siteSettings {
    key,value
  }
}
`;
