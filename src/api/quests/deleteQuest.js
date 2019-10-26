import request from '../request';

export default ({ id }) => {
  return request({
    url: `/api/quest/${id}`,
    method: 'DELETE',
  });
}