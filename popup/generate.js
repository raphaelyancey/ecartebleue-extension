function generate() {
  return axios.get('https://github.com')
  .then(function(res) {
    return JSON.parse(res);
  });
}