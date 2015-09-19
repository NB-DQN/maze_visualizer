function splitint(str) {
  return str.split(',').map(function(i) { return i | 0 });
}

function load_data(datastr) {
  var lines = datastr.split('\n');

  var size = splitint(lines[0]);

  var maze = new Array(size[0]);
  for (var i = 0; i < size[0]; i++) {
    maze[i] = new Array(size[1]);
    linenum = splitint(lines[i + 1]);
    for (var j = 0; j < size[1]; j++) {
      maze[i][j] = linenum.slice(j * 5, j * 5 + 5);
    }
  }

  var history = new Array(lines.length - (size[0] + 2));
  for (var i = size[0] + 2; i < history.length; i++) {
    history[i] = splitint(lines[size[0] + 2 + i]);
  }

  return {
    size: size,
    maze: maze,
    history: history
  }
}

function draw_maze(data) {
  console.log(data);
}

var obj = document.getElementById("datafile");
obj.addEventListener("change", function(ec) {
  var files = ec.target.files;
  var reader = new FileReader();
  reader.readAsText(files[0]);
  reader.onload = function(el) {
    draw_maze(load_data(reader.result));
  }
}, false);
