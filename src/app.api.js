export default function () {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve([{
        id: '1',
        name: 'Take a shower'
      }, {
        id: '2',
        name: 'Walk the dog'
      }, {
        id: '3',
        name: 'Go to work'
      }]);
    }, 500);
  });
}
