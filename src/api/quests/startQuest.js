import request from '../request';

export default ({ quest_id }) => {
  return request({
    url: `/api/quest/${quest_id}/start`,
    method: 'POST',
  });
}
