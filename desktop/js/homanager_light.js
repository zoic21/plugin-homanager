
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

 $('#bt_addLight').on('click',function(){
     bootbox.prompt("{{Nom de la zone ?}}", function (result) {
        if (result !== null && result != '') {
            addZLight({name: result});
        }
    });
 });

 $('#div_zlights').delegate('.rename', 'click', function () {
    var el = $(this);
    bootbox.prompt("{{Nouveau nom ?}}", function (result) {
        if (result !== null && result != '') {
            var previousName = el.text();
            el.text(result);
            el.closest('.panel.panel-default').find('span.name').text(result);
        }
    });
});

 $("#div_zlights").delegate('.bt_removeZlight', 'click', function () {
    $(this).closest('.zlight').remove();
});

 $("#div_zlights").delegate('.bt_removeLight', 'click', function () {
    $(this).closest('.light').remove();
});

 $("#div_zlights").delegate('.bt_removePresence', 'click', function () {
    $(this).closest('.presence').remove();
});

 $("#div_zlights").delegate('.bt_removeLuminosity', 'click', function () {
    $(this).closest('.luminosity').remove();
});

 $("#div_zlights").delegate('.bt_addLight', 'click', function () {
    addLight({},$(this).closest('.zlight'));
});

 $("#div_zlights").delegate('.bt_addPresence', 'click', function () {
    addPresence({},$(this).closest('.zlight'));
});

 $("#div_zlights").delegate('.bt_addLuminosity', 'click', function () {
    addLuminosity({},$(this).closest('.zlight'));
});

 /********************************LIGHT*************************************************/

 function saveLight(_eqLogic){
     _eqLogic.configuration.zlights = [];
     $('#div_zlights .zlight').each(function () {
        var zlight = $(this).getValues('.zlightAttr')[0];
        zlight.light = $(this).find('.div_light').getValues('.lightAttr');
        zlight.presence = $(this).find('.div_presence').getValues('.presenceAttr');
        zlight.luminosity = $(this).find('.div_luminosity').getValues('.luminosityAttr');
        _eqLogic.configuration.zlights.push(zlight);
    });
     return _eqLogic;
 }

 function printLight(_eqLogic){
    $('#div_zlights').empty();
    if (isset(_eqLogic.configuration.zlights)) {
        for (var i in _eqLogic.configuration.zlights) {
            addZLight(_eqLogic.configuration.zlights[i]);
        }
    }
}

function addZLight(_zlight) {
    if (init(_zlight.name) == '') {
        return;
    }
    var random = Math.floor((Math.random() * 1000000) + 1);
    var div = '<div class="zlight panel panel-default">';
    div += '<div class="panel-heading">';
    div += '<h4 class="panel-title">';
    div += '<a data-toggle="collapse" data-parent="#div_zlights" href="#collapse' + random + '">';
    div += '<span class="name">' + _zlight.name + '</span>';
    div += '</a>';
    div += '</h4>';
    div += '</div>';
    div += '<div id="collapse' + random + '" class="panel-collapse collapse in">';
    div += '<div class="panel-body">';

    div += '<div class="well">';
    div += '<form class="form-horizontal" role="form">';
    div += '<div class="form-group">';
    div += '<label class="col-sm-1 control-label">{{Nom de la zone}}</label>';
    div += '<div class="col-sm-2">';
    div += '<span class="zlightAttr label label-info rename cursor" data-l1key="name" style="font-size : 1em;" ></span>';
    div += '</div>';
    div += '<div class="col-sm-2">';
    div += '<label><input type="checkbox" class="zlightAttr checkbox-inline" data-l1key="enable" checked />{{Activer}}</label>';
    div += '</div>';
    div += '<div class="col-sm-7">';
    div += '<div class="btn-group pull-right" role="group">';
    div += '<a class="btn btn-sm bt_removeZlight btn-primary"><i class="fa fa-minus-circle"></i> {{Supprimer}}</a>';
    div += '<a class="btn btn-sm bt_addLight btn-danger"><i class="fa fa-plus-circle"></i> {{Lumière}}</a>';
    div += '<a class="btn btn-warning btn-sm bt_addPresence"><i class="fa fa-plus-circle"></i> {{Capteur de présence}}</a>';
    div += '<a class="btn btn-sm bt_addLuminosity btn-success"><i class="fa fa-plus-circle"></i> {{Capteur de Luminosité}}</a>';
    div += '</div>';
    div += '</div>';
    div += '</div>';
    div += '<div class="div_light"></div>';
    div += '<hr/>';
    div += '<div class="div_presence"></div>';
    div += '<hr/>';
    div += '<div class="div_luminosity"></div>';
    div += '</form>';
    div += '</div>';

    div += '</div>';
    div += '</div>';
    div += '</div>';

    $('#div_zlights').append(div);
    $('#div_zlights .zlight:last').setValues(_zlight, '.zlightAttr');
    if (is_array(_zlight.light)) {
        for (var i in _zlight.light) {
            if(!$.isPlainObject(_zlight.light[i])){
                continue;
            }
            addLight(_zlight.light[i],$('#div_zlights .zlight:last'));
        }
    } else {
        if ($.trim(_zlight.light) != '') {
            addLight(_zlight.light[i],$('#div_zlights .zlight:last'));
        }
    }

    if (is_array(_zlight.presence)) {
        for (var i in _zlight.presence) {
            if(!$.isPlainObject(_zlight.presence[i])){
                continue;
            }
            addPresence(_zlight.presence[i],$('#div_zlights .zlight:last'));
        }
    } else {
        if ($.trim(_zlight.presence) != '') {
            addPresence(_zlight.presence,$('#div_zlights .zlight:last'));
        }
    }

    if (is_array(_zlight.luminosity)) {
        for (var i in _zlight.luminosity) {
            if(!$.isPlainObject(_zlight.luminosity[i])){
                continue;
            }
            addLuminosity(_zlight.luminosity[i],$('#div_zlights .zlight:last'));
        }
    } else {
        if ($.trim(_zlight.luminosity) != '') {
            addLuminosity(_zlight.luminosity,$('#div_zlights .zlight:last'));
        }
    }
    $('.collapse').collapse();
}

function addLight(_light,_el){
  if (!isset(_light)) {
    _light = {};
}
var div = '<div class="light">';
div += '<div class="form-group">';
div += '<label class="col-sm-1 control-label">{{Allumage}}</label>';
div += '<div class="col-sm-5">';
div += '<div class="input-group">';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-default bt_removeLight btn-sm"><i class="fa fa-minus-circle"></i></a>';
div += '</span>';
div += '<input class="lightAttr form-control input-sm" data-l1key="cmdOn" />';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-sm listCmd btn-default" data-cmdType="action"><i class="fa fa-list-alt"></i></a>';
div += '</span>';
div += '</div>';
div += '</div>';

div += '<label class="col-sm-1 control-label">{{Extinction}}</label>';
div += '<div class="col-sm-5">';
div += '<div class="input-group">';
div += '<input class="lightAttr form-control input-sm" data-l1key="cmdOff" />';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-sm listCmd btn-default" data-cmdType="action"><i class="fa fa-list-alt"></i></a>';
div += '</span>';
div += '</div>';
div += '</div>';
div += '</div>';

div += '</div>';
_el.find('.div_light').append(div);
_el.find('.div_light .light:last').setValues(_light, '.lightAttr');
}

function addPresence(_presence,_el){
  if (!isset(_presence)) {
    _presence = {};
}
var div = '<div class="presence">';
div += '<div class="form-group">';
div += '<label class="col-sm-1 control-label">{{Présence}}</label>';
div += '<div class="col-sm-3">';
div += '<div class="input-group">';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-default bt_removePresence btn-sm"><i class="fa fa-minus-circle"></i></a>';
div += '</span>';
div += '<input class="presenceAttr form-control input-sm" data-l1key="cmd" />';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-sm listCmd btn-default" data-cmdType="info"><i class="fa fa-list-alt"></i></a>';
div += '</span>';
div += '</div>';
div += '</div>';
div += '<div class="col-sm-2">';
div += '<label><input type="checkbox" class="presenceAttr checkbox-inline" data-l1key="invert" />{{Inverser}}</label>';
div += '</div>';
div += '</div>';
div += '</div>';

div += '</div>';
_el.find('.div_presence').append(div);
_el.find('.div_presence .presence:last').setValues(_presence, '.presenceAttr');
}

function addLuminosity(_luminosity,_el){
  if (!isset(_luminosity)) {
    _luminosity = {};
}
var div = '<div class="luminosity">';
div += '<div class="form-group">';
div += '<label class="col-sm-1 control-label">{{Luminosité}}</label>';
div += '<div class="col-sm-3">';
div += '<div class="input-group">';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-default bt_removeLuminosity btn-sm"><i class="fa fa-minus-circle"></i></a>';
div += '</span>';
div += '<input class="luminosityAttr form-control input-sm" data-l1key="cmd" />';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-sm listCmd btn-default" data-cmdType="info"><i class="fa fa-list-alt"></i></a>';
div += '</span>';
div += '</div>';
div += '</div>';

div += '<label class="col-sm-1 control-label">{{Seuil}}</label>';
div += '<div class="col-sm-2">';
div += '<input class="luminosityAttr form-control input-sm" data-l1key="threshold" />';
div += '</div>';
div += '</div>';

div += '</div>';
div += '</div>';
_el.find('.div_luminosity').append(div);
_el.find('.div_luminosity .luminosity:last').setValues(_luminosity, '.luminosityAttr');
}