import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// Unlike the previous smoke test using ReactDOM.render(), this test only renders <App> and doesn’t go deeper. 
it('renders without crashing', () => {
  shallow(<App />);
});