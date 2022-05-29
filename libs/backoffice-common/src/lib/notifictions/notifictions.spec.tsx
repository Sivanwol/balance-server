import { render } from '@testing-library/react';

import Notifictions from './notifictions';

describe('Notifictions', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Notifictions />);
    expect(baseElement).toBeTruthy();
  });
});
