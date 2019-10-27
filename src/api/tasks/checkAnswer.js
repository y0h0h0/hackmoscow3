import request from '../request';

export default ({ quest_id, task_id, answer }) => {
  return request({
    url: `/api/quest/${quest_id}/check`,
    method: 'POST',
    data: {
      task_id, answer
    },
  });
}
