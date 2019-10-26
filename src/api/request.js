export default ({
  data,
  method,
  url,
}) => {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data),
  }).then((response) =>
    response.json()
  ).catch((response) => {
    console.error(response);
  });
}