
/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */

 $('#bt_addShutter').on('click',function(){
   bootbox.prompt("{{Nom de la zone ?}}", function (result) {
    if (result !== null && result != '') {
        addZShutter({name: result});
    }
});
});

 $('#div_zshutters').delegate('.rename', 'click', function () {
    var el = $(this);
    bootbox.prompt("{{Nouveau nom ?}}", function (result) {
        if (result !== null && result != '') {
            var previousName = el.text();
            el.text(result);
            el.closest('.panel.panel-default').find('span.name').text(result);
        }
    });
});

 $("#div_zshutters").delegate('.bt_removeZshutter', 'click', function () {
    $(this).closest('.zshutter').remove();
});

 $("#div_zshutters").delegate('.bt_removeShutter', 'click', function () {
    $(this).closest('.shutter').remove();
});

 $("#div_zshutters").delegate('.bt_removeWindow', 'click', function () {
    $(this).closest('.window').remove();
});

 $("#div_zshutters").delegate('.bt_addShutter', 'click', function () {
    addShutter({},$(this).closest('.zshutter'));
});

 $("#div_zshutters").delegate('.bt_addWindow', 'click', function () {
    addWindow({},$(this).closest('.zshutter'));
});

 /********************************LIGHT*************************************************/

 function saveShutter(_eqLogic){
   _eqLogic.configuration.zshutters = [];
   $('#div_zshutters .zshutter').each(function () {
    var zshutter = $(this).getValues('.zshutterAttr')[0];
    zshutter.shutter = $(this).find('.div_shutter').getValues('.shutterAttr');
    zshutter.window = $(this).find('.div_window').getValues('.windowAttr');
    _eqLogic.configuration.zshutters.push(zshutter);
});
   return _eqLogic;
}

function printShutter(_eqLogic){
    $('#div_zshutters').empty();
    if (isset(_eqLogic.configuration.zshutters)) {
        for (var i in _eqLogic.configuration.zshutters) {
            addZShutter(_eqLogic.configuration.zshutters[i]);
        }
    }
}

function addZShutter(_zshutter) {
    if (init(_zshutter.name) == '') {
        return;
    }
    var random = Math.floor((Math.random() * 1000000) + 1);
    var div = '<div class="zshutter panel panel-default">';
    div += '<div class="panel-heading">';
    div += '<h4 class="panel-title">';
    div += '<a data-toggle="collapse" data-parent="#div_zshutters" href="#collapse' + random + '">';
    div += '<span class="name">' + _zshutter.name + '</span>';
    div += '</a>';
    div += '</h4>';
    div += '</div>';
    div += '<div id="collapse' + random + '" class="panel-collapse collapse in">';
    div += '<div class="panel-body">';

    div += '<div class="well">';
    div += '<form class="form-horizontal" role="form">';
    div += '<div class="form-group">';
    div += '<label class="col-sm-1 control-label">{{Nom de la zone}}</label>';
    div += '<div class="col-sm-1">';
    div += '<span class="zshutterAttr label label-info rename cursor" data-l1key="name" style="font-size : 1em;" ></span>';
    div += '</div>';
    div += '<div class="col-sm-5">';
    div += '<label><input type="checkbox" class="zshutterAttr checkbox-inline" data-l1key="enable" checked />{{Activer}}</label> ';
    div += '<label><input type="checkbox" class="zshutterAttr checkbox-inline" data-l1key="doNotCloseIfWindowOpen" checked />{{Ne pas fermer si la fenêtre est ouverte}}</label>';
    div += '</div>';
    div += '<div class="col-sm-5">';
    div += '<div class="btn-group pull-right" role="group">';
    div += '<a class="btn btn-sm bt_removeZshutter btn-primary"><i class="fa fa-minus-circle"></i> {{Supprimer}}</a>';
    div += '<a class="btn btn-sm bt_addShutter btn-danger"><i class="fa fa-plus-circle"></i> {{Volet}}</a>';
    div += '<a class="btn btn-warning btn-sm bt_addWindow"><i class="fa fa-plus-circle"></i> {{Fenêtre}}</a>';
    div += '</div>';
    div += '</div>';
    div += '</div>';
    div += '<div class="div_shutter"></div>';
    div += '<hr/>';
    div += '<div class="div_window"></div>';
    div += '</form>';
    div += '</div>';

    div += '</div>';
    div += '</div>';
    div += '</div>';
    $('#div_zshutters').append(div);
    $('#div_zshutters .zshutter:last').setValues(_zshutter, '.zshutterAttr');
    if (is_array(_zshutter.shutter)) {
        for (var i in _zshutter.shutter) {
            if(!$.isPlainObject(_zshutter.shutter[i])){
                continue;
            }
            addShutter(_zshutter.shutter[i],$('#div_zshutters .zshutter:last'));
        }
    } else {
        if ($.trim(_zshutter.shutter) != '') {
            addShutter(_zshutter.shutter[i],$('#div_zshutters .zshutter:last'));
        }
    }

    if (is_array(_zshutter.window)) {
        for (var i in _zshutter.window) {
            if(!$.isPlainObject(_zshutter.window[i])){
                continue;
            }
            addWindow(_zshutter.window[i],$('#div_zshutters .zshutter:last'));
        }
    } else {
        if ($.trim(_zshutter.window) != '') {
            addWindow(_zshutter.window,$('#div_zshutters .zshutter:last'));
        }
    }
    $('.collapse').collapse();
}

function addShutter(_shutter,_el){
  if (!isset(_shutter)) {
    _shutter = {};
}
var div = '<div class="shutter">';
div += '<div class="form-group">';
div += '<label class="col-sm-1 control-label">{{Ouverture}}</label>';
div += '<div class="col-sm-5">';
div += '<div class="input-group">';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-default bt_removeShutter btn-sm"><i class="fa fa-minus-circle"></i></a>';
div += '</span>';
div += '<input class="shutterAttr form-control input-sm" data-l1key="cmdOpen" />';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-sm listCmd btn-default" data-cmdType="action"><i class="fa fa-list-alt"></i></a>';
div += '</span>';
div += '</div>';
div += '</div>';

div += '<label class="col-sm-1 control-label">{{Fermeture}}</label>';
div += '<div class="col-sm-5">';
div += '<div class="input-group">';
div += '<input class="shutterAttr form-control input-sm" data-l1key="cmdClose" />';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-sm listCmd btn-default" data-cmdType="action"><i class="fa fa-list-alt"></i></a>';
div += '</span>';
div += '</div>';
div += '</div>';
div += '</div>';

div += '</div>';
_el.find('.div_shutter').append(div);
_el.find('.div_shutter .shutter:last').setValues(_shutter, '.shutterAttr');
}

function addWindow(_window,_el){
  if (!isset(_window)) {
    _window = {};
}
var div = '<div class="window">';
div += '<div class="form-group">';
div += '<label class="col-sm-1 control-label">{{Fenêtre}}</label>';
div += '<div class="col-sm-3">';
div += '<div class="input-group">';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-default bt_removeWindow btn-sm"><i class="fa fa-minus-circle"></i></a>';
div += '</span>';
div += '<input class="windowAttr form-control input-sm" data-l1key="cmd" />';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-sm listCmd btn-default" data-cmdType="info"><i class="fa fa-list-alt"></i></a>';
div += '</span>';
div += '</div>';
div += '</div>';
div += '<div class="col-sm-2">';
div += '<label><input type="checkbox" class="windowAttr checkbox-inline" data-l1key="invert" />{{Inverser}}</label>';
div += '</div>';
div += '</div>';
div += '</div>';

div += '</div>';
_el.find('.div_window').append(div);
_el.find('.div_window .window:last').setValues(_window, '.windowAttr');
}