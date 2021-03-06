function splitint(str) {
  return str.split(',').map(function(i) { return i | 0 });
}

function addClassName(element, className) {
  element.className += " " + className;
}

function deleteClassName(element, className) {
  element.className = element.className.replace(className,'');
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
  for (var i = 0; i < history.length; i++) {
    history[i] = splitint(lines[size[0] + 2 + i]);
  }

  return {
    size: size,
    maze: maze,
    history: history
  }
}

function draw_maze(data, filename) {
  root = document.getElementById("visualizer");
  root.innerHTML = "";

  for (var j = data.size[1] - 1; j >= 0; j--) {
    row = document.createElement("div");
    row.className = "maze-row";
    root.appendChild(row);

    for (var i = 0; i < data.size[0]; i++ ) {
      var cell = document.createElement("div");
      cell.id = [i, j].join("");
      cell.className = "maze-cell maze-cell-0";

      for (var k = 0; k < 4; k++) {
        if (data.maze[i][j][k] == 1) {
          addClassName(cell, "maze-cell-wall-" + k);
        }
      }

      if (data.maze[i][j][4] == 1) {
        cell.innerHTML = "G";
        addClassName(cell, "maze-goal");
      }

      row.appendChild(cell);
    }

    if (j != 0) {
      clearfix = document.createElement("div");
      clearfix.className = "clearfix";
      root.appendChild(clearfix);
    }
  }

  cap = document.getElementById("caption");
  console.log(filename)
  switch (filename) {
    case 'depth_first.log':
      text = 'depth-first binary-tree search';
      break;
    case 'q_trained.log':
      text = 'Q agent';
      break;
    case 'q_untrained.log' :
      text = 'Q agent: not trained maze';
      break;
    case 'rand.log':
      text = 'random walker';
      break;
    case 'visual.log':
      text = 'novelty search with place cell';
      break;
  }
  cap.innerHTML = text;
}

function run_maze(data) {
  var i = 0;
  var history = data.history;
  var timer = setInterval( function() {
    if (i > 0) {
      deleteClassName(document.getElementById(history[i - 1].join("")), "agent");
    }
    var cell = document.getElementById(history[i].join(""))
      addClassName(cell, "agent");

    count = cell.className.match(/maze-cell-(\d)/)[1] | 0;
    if (count < 9) {
      deleteClassName(cell, "maze-cell-" + count);
      addClassName(cell, "maze-cell-" + (count + 1));
    }

    if (i == history.length - 2) {
      clearInterval(timer);
    }
    i += 1;
  }, 150);
}

var obj = document.getElementById("datafile");
obj.addEventListener("change", function(ec) {
  var files = ec.target.files;
  var reader = new FileReader();
  reader.readAsText(files[0]);
  reader.onload = function(el) {
    data = load_data(reader.result);
    draw_maze(data, ec.target.files[0].name);
    run_maze(data);
  }
}, false);
