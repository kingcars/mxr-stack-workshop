export default function () {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve([{
        id: '16n5jkgfc0d4k760',
        name: 'Take a shower'
      }, {
        id: '9a2889n7f55s410v',
        name: 'Walk the dog'
      }, {
        id: 'pmakvvvb1s2aapkf',
        name: 'Go to work'
      }]);
    }, 500);
  });
}
