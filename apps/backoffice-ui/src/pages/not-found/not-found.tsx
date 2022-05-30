import styles from './not-found.module.styl';

/* eslint-disable-next-line */
export interface NotFoundProps {}

export function NotFound(props: NotFoundProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to NotFound!</h1>
    </div>
  );
}

export default NotFound;
