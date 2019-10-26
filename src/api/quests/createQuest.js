import request from '../request';

export default (data) => {
  return request({
    url: `/api/quest/create`,
    method: 'POST',
    data,
  });
}