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
  cx: 350,
  cy: 225
}];

    


var drag = d3.behavior.drag()
      .on('drag', function(d, i) {
        //
      });
   
//Scoreboard
d3.select('body').insert('div', ':first-child').attr('class', 'scoreboard').selectAll('div')
  .data([
    { class: 'highscore',
      text: 'High score: '},
    { class: 'current',
      text: 'Current score: '}, 
    { class: 'collisions',
      text: 'Collisions: '}
  ]).enter().append('div')
    .attr('class', function(d) { return d.class; })
    .text(function(d) { return d.text; });
d3.select('.scoreboard').selectAll('div').insert('span').text('0');

//Gameboard
d3.select('.board').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  .style('border-size', '3px')
  .style('border-color', 'red')
  .style('border-style', 'solid');


d3.select('.board').select('svg').append('circle').data(player)

  .call(drag);


//UPDATE
var update = function (data) {
  //JOIN
  var selection = d3.select('.board').select('svg').selectAll('image').data(data, function(d) { return d.id; });

  //UPDATE current enemies
  //translate to d.x and d.y
  selection.transition()
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .duration(1000);

  //ENTER  
  selection.enter().append('image')
    .attr('href', enemySrc)
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', 20)
    .attr('height', 20);

};
update(enemies());
setInterval(function() {
  update(enemies());
}, 1000);


