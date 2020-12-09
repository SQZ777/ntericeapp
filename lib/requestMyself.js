const https = require('https');

function requestToMyself() {
  const options = {
    hostname: 'ntericeapp.herokuapp.com',
    port: 443,
    path: '/',
    method: 'GET',
  };
  https.request(options, (resp) => {
    console.log(`request my self: ${resp.statusCode}`);
  }).end();
}

module.exports = {
  requestToMyself,
};
