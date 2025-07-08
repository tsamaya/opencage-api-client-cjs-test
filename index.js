const opencage = require('opencage-api-client');

opencage
  .geocode({
    q: 'Münster',
    // this key always return a result
    // https://opencagedata.com/api#testingkeys
    key: '6d0e711d72d74daeb2b0bfd2a5cdfdba',
  })
  .then((data) => {
    console.log(JSON.stringify(data));
  })
  .catch((error) => {
    console.log('error', error.message);
  });
