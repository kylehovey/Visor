import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';

import App, {
  GET_AIR_READING,
} from './App';

const mocks = [{
  request: {
    query: GET_AIR_READING,
  },
  result: {
    data: {
      airReading: {
        pm25: 3,
      },
    },
  },
}];

test('renders the app', async () => {
  const [ { result } ] = mocks;

  const {
    data: {
      airReading: {
        pm25,
      },
    },
  } = result;;

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  expect(screen.queryByText(/loading/i)).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

  expect(screen.getByText(`Current Value: ${pm25}µg/m³`)).toBeInTheDocument(1);
});
