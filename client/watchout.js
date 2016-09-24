// start slingin' some d3 here.
//SETUP
var enemySrc = 'asteroid.png';
var gameOptions = {
  height: 450,
  width: 700,
  numEnemies: 20
};

var enemies = function() {
  var result = [];
  for (var i = 0; i < gameOptions.numEnemies; i++) {
    var randX = Math.random() * gameOptions.width;
    var randY = Math.random() * gameOptions.height;
    result.push({ id: i, x: randX, y: randY});
  }
  return result;
};

var player = [{
  x: 350,
  y: 225
}];

var theSBoard = [
  { class: 'highscore',
    text: 'High score: ',
    x: gameOptions.width - 125,
    y: 20,
    val: 0},
  { class: 'current',
    text: 'Current score: ',
    x: gameOptions.width - 125,
    y: 40,
    val: 0}, 
  { class: 'collisions',
    text: 'Collisions: ',
    x: gameOptions.width - 125,
    y: 60,
    val: 0}
];

var score = 0;
var collisions = 0;
var highscore = 0;

   
//Scoreboard
// d3.select('body').insert('div', ':first-child').attr('class', 'scoreboard').selectAll('div')
//   .data([
//     { class: 'highscore',
//       text: 'High score: '},
//     { class: 'current',
//       text: 'Current score: '}, 
//     { class: 'collisions',
//       text: 'Collisions: '}
//   ]).enter().append('div')
//     .attr('class', function(d) { return d.class; })
//     .text(function(d) { return d.text; });
// d3.select('.scoreboard').selectAll('div').insert('span').text('0');

//Gameboard
var gameBoard = d3.select('.board').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  .style('border-size', '3px')
  .style('border-color', 'red')
  .style('border-style', 'solid');

//Scoreboard
var updateScoreBoard = function () {

  var selection = d3.select('.board').select('svg').selectAll('text');

  //UPDATE
  selection.data(theSBoard).text(function(d) { return d.text + ' ' + d.val; });

  //ENTER
  selection.data(theSBoard).enter().append('text')
    .attr('class', function(d) { return d.class; })
    .text(function(d) { return d.text + ' ' + d.val; })
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('fill', 'white');
};
//Drag
var drag = d3.behavior.drag()
      .on('drag', function(d) {
        var x = d3.event.x;
        var y = d3.event.y;
        d.x = x;
        d.y = y;
        p.attr('transform', 'translate(' + x + ',' + y + ')');
      });

//Player
var p = d3.select('.board').select('svg').append('circle').data(player)
  .attr('transform', 'translate(' + player[0].x + ',' + player[0].y + ')')
  .attr('r', '15')
  .style('cursor', 'pointer')
  .attr('fill', 'yellow')
  .call(drag);


var checkCollision = function(x, y) {

  var threshold = 30;
  var a = player[0].x;
  var b = x;
  var c = player[0].y;
  var d = y;
  var distance = Math.sqrt (Math.pow((player[0].x - x), 2) + Math.pow((player[0].y - y), 2));
  //debugger;
  if (distance <= threshold) {
    isCollided = true;
    setTimeout(function() {
      isCollided = false;
    }, 500);
    if (theSBoard[1].val > theSBoard[0].val) {
      theSBoard[0].val = theSBoard[1].val;
    }
    theSBoard[1].val = 0;
    updateScore();
    theSBoard[2].val++;
    updateScoreBoard();
    //d3.select('svg').select('.collisions').text(collisions);
    //d3.select('svg').select('.highscore').text(highscore);
  }
};

var updateScore = function() {
  updateScoreBoard();
};

var isCollided = false;
var collisionStart = function() {
  if (!isCollided) {
    var asteroids = d3.select('.board').selectAll('image');
    asteroids.each(function() {
      var single = d3.select(this);
      checkCollision(single.attr('x'), single.attr('y'));
    });
  }
};



//UPDATE
var update = function (data) {
  //JOIN
  var selection = d3.select('.board').select('svg').selectAll('image').data(data, function(d) { return d.id; });

  //UPDATE current enemies
  //translate to d.x and d.y
  selection.transition()
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .duration(750);

  //ENTER  
  selection.enter().append('image')
    .attr('href', enemySrc)
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', 30)
    .attr('height', 30);

};

setInterval( function() {
  theSBoard[1].val++;
  updateScore();
}, 50);
setInterval(collisionStart, 10);
update(enemies());
setInterval(function() {
  update(enemies());
}, 750);


