import { useMutation, gql } from '@apollo/client';

import { GET_TRADFRI_DEVICES } from '../App';

const SET_TRADFRI_STATUS = gql`
mutation Tradfri($id: String!, $type: TradfriDeviceType!, $status: Int!) {
  setTradfriStatus(id: $id, type: $type, status:$status)
}
`;

const TradfriToggle = ({ id, name, type, status }) => {
  const active = status > 0;
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
  });

  return (
    <div className="tradfri-toggle-container">
      <button
        className={active ? 'on' : 'off'}
        onClick={toggleStatus}
      >
        {name}
      </button>
    </div>
  );
};

export default TradfriToggle;
