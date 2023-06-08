const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: { origin: '*' }
});

const port = 3000;
var msgArr = [];
var items = [];
for (var i = 0; i < 10; i++) {
  items[i] = [];
  for (var j = 0; j < 10; j++) {
    items[i][j] = { row: i, col: j, label: i + "x" + j };
  }
}
var count = 0;
var itemPrev;

io.on('connection', (socket) => {

  console.log(`${socket.id}: connected`);
  io.emit('message', msgArr);
  io.emit('items', items);

  socket.on('message', (message) => {
    msgArr.push(`${socket.id}: ${message}`)
    io.emit('message', msgArr);
  });
  socket.on('item', (item) => {
    var valueCurrent = count%2 == 0 ? 'even' : 'odd';
    items[item.row][item.col].elm = valueCurrent;
    items[item.row][item.col].isCurrent = true;
    if(itemPrev){
      items[itemPrev.row][itemPrev.col].isCurrent = false;
    }
    itemPrev = item;
    count++;
    io.emit('items', items);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));