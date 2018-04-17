
// node globals?
console.log(process.env);

// browser globals?
console.log(window.addEventListener);

// atv globals
console.log(atv.player.events.Play);

// normal stuff
console.log(Date.now())
console.log(JSON.stringify({foo: 'bar'}));
Object.assign({foo: 1}, {bar: 2});

// jest stuff
jest.mock('mongo-bongo');
