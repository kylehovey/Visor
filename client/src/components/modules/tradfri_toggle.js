import "react-toggle/style.css";

import { useMutation, gql } from '@apollo/client';
import Toggle from 'react-toggle';
import { useState } from 'react';

import { GET_TRADFRI_DEVICES } from '../App';

const SET_TRADFRI_STATUS = gql`
mutation Tradfri($id: String!, $type: TradfriDeviceType!, $status: Int!) {
  setTradfriStatus(id: $id, type: $type, status:$status)
}
`;

const TradfriToggle = ({ id, name, type, status }) => {
  const active = status > 0;
  const [waiting, setWaiting] = useState(false);
  const [setStatus] = useMutation(SET_TRADFRI_STATUS);
  const toggleStatus = () => setStatus({
    variables: {
      id,
      type,
      status: active
        ? 0
        : (type === 'plug' ? 1 : 254),
    },
    refetchQueries: [
      { query: GET_TRADFRI_DEVICES },
    ],
  }).finally(() => setWaiting(false));

  return (
    <label>
      <span className="toggle-title">{name}</span>
      <br />
      <Toggle
        className={waiting ? "waiting" : ""}
        onChange={toggleStatus}
        onClick={() => setWaiting(true)}
        checked={active}
        icons={false}
      />
    </label>
  );
};

export default TradfriToggle;
