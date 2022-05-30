import styles from './intro.module.styl';

/* eslint-disable-next-line */
export interface IntroProps {}

export function Intro(props: IntroProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Intro!</h1>
    </div>
  );
}

export default Intro;
