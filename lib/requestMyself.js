const { getRequest } = require('./request');

require('./request');

function requestToMyself() {
  getRequest({
    url: 'https://ntericeapp.herokuapp.com',
  });
}

module.exports = {
  requestToMyself,
};
