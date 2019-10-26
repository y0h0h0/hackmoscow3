import request from '../request';

export default ({
  id,
  ...data
}) => {
  return request({
    url: `/api/quest/${id}`,
    method: 'PATCH',
    data,
  });
}