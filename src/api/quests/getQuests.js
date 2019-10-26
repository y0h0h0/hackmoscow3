import request from '../request';

export default (data) => {
  return request({
    url: `/api/quests`,
    method: 'GET',
    data,
  });
}