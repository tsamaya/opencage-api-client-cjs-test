const opencage = require('opencage-api-client');
const { geocode } = require('opencage-api-client');

opencage
  .geocode({
    q: 'Münster',
    no_annotations: 1,
    // this key always return a result
    // https://opencagedata.com/api#testingkeys
    key: '6d0e711d72d74daeb2b0bfd2a5cdfdba',
  })
  .then((data) => {
    console.log('---Testing default export---');
    console.log(JSON.stringify(data));
  })
  .catch((error) => {
    console.log('error with default export', error.message);
  });

geocode({
  q: 'Münster',
  no_annotations: 1,
  // this key always return a result
  // https://opencagedata.com/api#testingkeys
  key: '6d0e711d72d74daeb2b0bfd2a5cdfdba',
})
  .then((data) => {
    console.log('--Testing named export--');
    console.log(JSON.stringify(data));
  })
  .catch((error) => {
    console.log('error with named export', error.message);
  });
