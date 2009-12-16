function updateInput() {
  $('#color-changer').get(0).color.fromString(localStorage[$('#sel option:selected').val()]);
}

function updateFont(attr, ui) {
  localStorage[attr] = ui.value + 'px';
}

$(document).ready(function() {
 $("#color-changer").change(function() {
    localStorage[$('#sel option:selected').val()] = $(this).val();
    reloadParams();
 }).val(localStorage['bg']);
 $('#sel').change(updateInput);
 $('#itemfont-slider').slider({
  max: 50, min: 12, value: localStorage['itemfont'].split('px')[0],
  change: function(e, u) { updateFont('itemfont', u); reloadParams(); },
  slide: function(e, u) { updateFont('itemfont', u); reloadParams(); }
 });

 $('#titlefont-slider').slider({
  max: 100, min: 12, value: localStorage['titlefont'].split('px')[0],
  change: function(e, u) { updateFont('titlefont', u); reloadParams(); },
  slide: function(e, u) { updateFont('titlefont', u); reloadParams(); }
 });

$('#pagewidth-slider').slider({
  max: 2000, min: 100, value: localStorage['pagewidth'].split('px')[0],
  change: function(e, u) { updateFont('pagewidth', u); reloadParams(); },
  slide: function(e, u) { updateFont('pagewidth', u); reloadParams(); }
 });

$('#itemwidth-slider').slider({
  max: 2000, min: 100, value: localStorage['itemwidth'].split('px')[0],
  change: function(e, u) { updateFont('itemwidth', u); reloadParams(); },
  slide: function(e, u) { updateFont('itemwidth', u); reloadParams(); }
 });
});
