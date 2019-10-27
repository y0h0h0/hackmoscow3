export default ({
  data,
  method,
  url,
}) => {
  for (let key in data) {
    if (data[key] === null) {
      delete data[key];
    } 
  }
  const options = {
    method,
  };
  switch (method) {
    case 'PATCH':
    case 'POST':
      // const fd = new FormData();
      // for (let key in data) {
      //   fd.append(key, data[key]);
      // }
      if (data && Object.keys(data).length) {
        Object.assign(options, {
          // body: fd,
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(data),
        });
      }
      break;
    case 'DELETE':
    case 'GET':
      if (data && Object.keys(data).length) {
        const fd = [];
        for (let key in data) {
          fd.push(`${key}=${data[key]}`);
        }
        url += '?' + fd.join('&');
      }
      break;
    default:
  }
  return fetch(url, options).then((response) => {
    return response.json();
  }).catch((response) => {
    console.error(response);
  });
}