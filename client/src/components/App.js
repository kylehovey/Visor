import React, { useState } from 'react';
import { useQuery, useSubscription, useMutation, gql } from '@apollo/client';

const App = () => {
  const [ name, setName ] = useState('');
  const [ history, setHistory ] = useState([]);

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery(gql`
    query GetHelloWorld {
      helloWorld {
        hello
      }
    }
  `);

  const [
    sayHello,
    {
      loading: mutationLoading,
      called: mutationCalled,
      error: mutationError,
      data: mutationData,
    },
  ] = useMutation(gql`
    mutation SayHello($name: String!) {
      sayHello(name: $name)
    }
  `);

  const { error: subscriptionError } = useSubscription(gql`
    subscription RandomNumber {
      randomNumber
    }
  `, {
    onSubscriptionData: ({ subscriptionData }) => {
      const {
        data: {
          randomNumber,
        },
      } = subscriptionData;

      setHistory([...history, randomNumber]);
    },
  });

  if (queryLoading) return 'Loading...';

  if (queryError) return JSON.stringify(queryError);
  if (mutationError) return JSON.stringify(mutationError);
  if (subscriptionError) return JSON.stringify(subscriptionError);

  const {
    helloWorld: {
      hello,
    },
  } = queryData;

  const apiMessage = (!mutationLoading && mutationCalled) ? (
    <span>API Response Recieved: {mutationData.sayHello}</span>
  ) : null;

  return (
    <div>
      <h1>{hello}</h1>
      <input
        value={name}
        onChange={({ target }) => setName(target.value)}
      />
      <button onClick={() => sayHello({ variables: { name } })}>Send</button>
      {apiMessage}
      <ul>{history.map((data, i) =><li key={i}>{data}</li>)}</ul>
    </div>
  );
}

export default App;
