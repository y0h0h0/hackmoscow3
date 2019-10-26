import request from '../request';

export default (data) => {
  return request({
    url: `/api/task/create`,
    method: 'POST',
    data,
  });
}