import { useAuth0 } from '@auth0/auth0-react';
import { Center, Button } from '@chakra-ui/react';
import styles from './intro.module.styl';
import { Loader } from '@balancer/backoffice-common';
import { useNavigate } from "react-router-dom";
/* eslint-disable-next-line */
export interface IntroProps {}

export function Intro(props: IntroProps) {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  if (isAuthenticated) {
    navigate('/overview', { replace: true })
  }
  return (
    <div className={styles['container']}>
      <Center>
        <Button color='black' onClick={() => loginWithRedirect()}>Please click for login</Button>
      </Center>
    </div>
  );
}

export default Intro;
