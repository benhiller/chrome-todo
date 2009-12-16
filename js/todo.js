function update() {
  var items = '["' + $('.item .content').map(function() {
    return $(this).text();
  }).get().join('", "') + '"]';
  localStorage.setItem('wisbd', items);
}

function setTitle(title) {
  localStorage.setItem('wisbd-title', title);
}

function newItem(str) {
  var li = $('<li class="item"><span class="drag">&#187;</span><span class="content">'+str+'</span><span class="widgets"><span class="up"></span><span class="down"></span><span class="remove"></span></span></li>');
  li.find('.up').html("&uArr;");
  li.find('.down').html('&dArr;');
  li.find('.remove').text('X');
  return li;
}

function defaultValue(id, def) {
  if(localStorage[id] === undefined) {
    localStorage[id] = def;
  }
}

var params = { bg: { def: 'FFFFFF', rules: [{ selector: 'body, .widgets', name: 'background-color' },
                                     { selector: '.item:first-child .up ', name: 'color' },
                                     { selector: '.item:nth-last-child(2) .down', name: 'color'}]},
               fg: { def: '000000', rules: [{ selector: 'body', name: 'color'},
                                     { selector: 'input, textarea', name: 'color' }]},
               arr: { def: 'DDDDDD', rules: [{ selector: '.down, .up', name: 'color' }]},
               arrh: { def: '888888', rules: [{ selector: '.down:hover, .up:hover', name: 'color' }]},
               box: { def: 'FFFFFF', rules: [{ selector: 'textarea, input', name: 'background-color' }]},
               del: { def: 'DD9999', rules: [{ selector: '.remove', name: 'color' }]},
               delh: { def: 'DD3030', rules: [{ selector: '.remove:hover', name: 'color' }]},
               itemfont: { def: '36px', rules: [{ selector: '#list, .container', name: 'font-size' }]},
               pagewidth: { def: '700px', rules: [{ selector: '#todo', name: 'width' }]},
               itemwidth: { def: '450px', rules: [{ selector: '#list, .container', name: 'width' }]},
               titlefont: { def: '55px', rules: [{ selector: 'h1, .title-edit', name: 'font-size' }]}};

// Used to give CSS rules a unique index so that they can be modified
var i = 0;

function reloadParams() {
  for(var param in params) { if(params.hasOwnProperty(param)) {
    defaultValue(param, params[param].def);
    for(var idx in params[param].rules) { if(params[param].rules.hasOwnProperty(idx)) {
      var rule = params[param].rules[idx];
      if(rule.index === undefined) {
        rule.index = i;
        i = i + 1;
      } else {
        document.styleSheets[0].deleteRule(rule.index);
      }
      document.styleSheets[0].insertRule(rule.selector + " { " + rule.name + ": " + localStorage[param] + "; }", rule.index);
    } }
  } }
}

$(document).ready(function() {
  reloadParams();

  $('#next').bind('keydown', function(e) {
    // Handle new items
    if(e.keyCode == 13) {
      if($('#next').val() != '') {
        $('#new-item').before(newItem($('#next').val()));
        update();
        $('#next').val('');
      }
    } else if (e.keyCode == 9) {
      if(e.shiftKey) {
        e.preventDefault();
        $('#next').parent().parent().prev('.item').children('.content').click();
        $(this).blur();
      } else {
        e.preventDefault();
        $('#list').find('li:first').find('.content').click();
        $(this).blur();
      }
    }
  }).click(function() {
    if($('#next').val() == '...') {
      $('#next').val('');
    }
  }).blur(function() {
    if($(this).val() == '') {
      $(this).val('...');
    }
  });

  // Handle removing items
  $(".remove").live("click", function() {
    $(this).parent().parent().replaceWith("");
    update();
  });

  $('.up').live('click', function() {
    var t = $(this).parent().parent();
    var n = t.prev('.item');
    if(n.length == 1) {
      var nContents = n.html();
      n.html(t.html());
      t.html(nContents);
    }
    update();
  });

  $('.down').live('click', function() {
    var t = $(this).parent().parent();
    var n = t.next('.item');
    if(n.length == 1) {
      var nContents = n.html();
      n.html(t.html());
      t.html(nContents);
    }
    update();
  });

  // Handle updating items
  $('.update .edit').live('keydown', function(e) {
    if(e.keyCode == 13) {
      if($(this).val() == '') {
        $(this).parent().parent().remove('li.update');
      } else {
        $(this).parent().parent().replaceWith(newItem($(this).val()));
      }
      update();
    } else if(e.keyCode == 9) {
      e.preventDefault();
      var li = newItem($(this).val());
      var next;
      if(!e.shiftKey) {
        next = $(this).parent().parent().next();
      } else {
        next = $(this).parent().parent().prev();
      }
      if(next.find('.content').length == 1) {
        next.find('.content').click();
      } else {
        $('#next').click().focus();
      }
      if($(this).val() == '') {
        $(this).parent().parent().remove('li.update');
      } else {
        $(this).parent().parent().replaceWith(li);
      }
      update();
    }
  });

  // Handle updating items
  $('.content').live('click', function() {
    var rep = $('<li class="update"></li>');
    rep.append('<span class="drag">&#187;</span><span class="container"><textarea class="edit">'+$(this).text()+'</textarea></span>');
    $(this).parent().replaceWith(rep);
    rep.find('textarea').blur(function() {
      $(this).parent().parent().replaceWith(newItem($(this).val()));
      update();
    }).focus().click().TextAreaExpander();
  });

  $('h1').toggle(function() {
    var rep = $('<input class="title-edit" type="text" value="'+ $(this).text() + '" />');
    $(this).html(rep);
    var done = function(t) {
      var title;
      if(t.val() != '') {
        title = t.val();
        t.parent().text(title);
        setTitle(title);
      } else {
        t.parent().text(title);
      }
    };

    rep.blur(function () { done($(this)); }).keydown(function(e) {
      if(e.keyCode == 13) {
        done($(this));
      }
    }).focus().click();
  },
  function() {});

  // Initialize
  var title = localStorage.getItem('wisbd-title');
  if(title === null || title == '') {
    title = 'Things to do';
    setTitle(title);
  }
  $('h1').text(title);

  $("#next").TextAreaExpander();

  var todo = JSON.parse(localStorage.getItem('wisbd'));
  if(todo !== undefined && todo !== null) {
    for(var i = todo.length-1; i >= 0; i--) {
      if(todo[i] != "") {
        $('#list').prepend(newItem(todo[i]));
      }
    }
  } else {
    $('#list').prepend(newItem('Use options on extension page to customize appearance'));
  }

  $("#list").dragsort({ dragEnd: update, dragSelector: ".drag" });
});
