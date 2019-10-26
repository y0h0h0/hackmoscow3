import request from '../request';

export default (data) => {
  return request({
    url: `/api/quests`,
    data,
    method: 'GET',
  });
}