
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

 $('#bt_addSpresence').on('click',function(){
   bootbox.prompt("{{Nom de la zone ?}}", function (result) {
    if (result !== null && result != '') {
        addZSpresence({name: result});
    }
});
});

 $('#div_zspresences').delegate('.rename', 'click', function () {
    var el = $(this);
    bootbox.prompt("{{Nouveau nom ?}}", function (result) {
        if (result !== null && result != '') {
            var previousName = el.text();
            el.text(result);
            el.closest('.panel.panel-default').find('span.name').text(result);
        }
    });
});

 $("#div_zspresences").delegate('.bt_removeZspresence', 'click', function () {
    $(this).closest('.zspresence').remove();
});

 $("#div_zspresences").delegate('.bt_removeSpresence', 'click', function () {
    $(this).closest('.spresence').remove();
});

 $("#div_zspresences").delegate('.bt_addSpresence', 'click', function () {
    addSpresence({},$(this).closest('.zspresence'));
});

 $('body').delegate('.spresence .expressionAttr[data-l1key=cmd]', 'focusout', function (event) {
    var expression = $(this).closest('.spresence').getValues('.expressionAttr');
    var el = $(this);
    jeedom.cmd.displayActionOption($(this).value(), init(expression[0].options), function (html) {
        el.closest('.spresence').find('.actionOptions').html(html);
        taAutosize();
    })
});

 /********************************LIGHT*************************************************/

 function saveSpresence(_eqLogic){
   _eqLogic.configuration.zspresences = [];
   $('#div_zspresences .zspresence').each(function () {
    var zspresence = $(this).getValues('.zspresenceAttr')[0];
    zspresence.spresence = $(this).find('.div_spresence').getValues('.expressionAttr');
    _eqLogic.configuration.zspresences.push(zspresence);
});
   return _eqLogic;
}

function printSpresence(_eqLogic){
    $('#div_zspresences').empty();
    if (isset(_eqLogic.configuration.zspresences)) {
        for (var i in _eqLogic.configuration.zspresences) {
            addZSpresence(_eqLogic.configuration.zspresences[i]);
        }
    }
}

function addZSpresence(_zspresence) {
    if (init(_zspresence.name) == '') {
        return;
    }
    var random = Math.floor((Math.random() * 1000000) + 1);
    var div = '<div class="zspresence panel panel-default">';
    div += '<div class="panel-heading">';
    div += '<h4 class="panel-title">';
    div += '<a data-toggle="collapse" data-parent="#div_zspresences" href="#collapse' + random + '">';
    div += '<span class="name">' + _zspresence.name + '</span>';
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
    div += '<span class="zspresenceAttr label label-info rename cursor" data-l1key="name" style="font-size : 1em;" ></span>';
    div += '</div>';
    div += '<div class="col-sm-1">';
    div += '<label><input type="checkbox" class="zspresenceAttr checkbox-inline" data-l1key="enable" checked />{{Activer}}</label> ';
    div += '</div>';
    div += '<label class="col-sm-1 control-label">{{De}}</label>';
    div += '<div class="col-sm-2">';
    div += '<input class="zspresenceAttr form-control" data-l1key="start" placeholder="HH:mm">';
    div += '</div>';
    div += '<label class="col-sm-1 control-label">{{à}}</label>';
    div += '<div class="col-sm-2">';
    div += '<input class="zspresenceAttr form-control" data-l1key="end" placeholder="HH:mm">';
    div += '</div>';
    div += '<div class="col-sm-3">';
    div += '<div class="btn-group pull-right" role="group">';
    div += '<a class="btn btn-sm bt_removeZspresence btn-primary"><i class="fa fa-minus-circle"></i> {{Supprimer}}</a>';
    div += '<a class="btn btn-sm bt_addSpresence btn-danger"><i class="fa fa-plus-circle"></i> {{Action}}</a>';
    div += '</div>';
    div += '</div>';
    div += '</div>';
    div += '<div class="div_spresence"></div>';
    div += '</form>';
    div += '</div>';
    div += '</div>';
    div += '</div>';
    div += '</div>';
    $('#div_zspresences').append(div);
    $('#div_zspresences .zspresence:last').setValues(_zspresence, '.zspresenceAttr');
    if (is_array(_zspresence.spresence)) {
        for (var i in _zspresence.spresence) {
            if(!$.isPlainObject(_zspresence.spresence[i])){
                continue;
            }
            addSpresence(_zspresence.spresence[i],$('#div_zspresences .zspresence:last'));
        }
    } else {
        if ($.trim(_zspresence.spresence) != '') {
            addSpresence(_zspresence.spresence[i],$('#div_zspresences .zspresence:last'));
        }
    }
    $('.collapse').collapse();
}

function addSpresence(_spresence,_el){
  if (!isset(_spresence)) {
    _spresence = {};
}
var div = '<div class="spresence">';
div += '<div class="form-group">';
div += '<label class="col-sm-1 control-label">{{Action}}</label>';
div += '<div class="col-sm-5">';
div += '<div class="input-group">';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-default bt_removeSpresence btn-sm"><i class="fa fa-minus-circle"></i></a>';
div += '</span>';
div += '<input class="expressionAttr form-control input-sm" data-l1key="cmd" />';
div += '<span class="input-group-btn">';
div += '<a class="btn btn-sm listCmd btn-default" data-cmdType="action"><i class="fa fa-list-alt"></i></a>';
div += '</span>';
div += '</div>';
div += '</div>';

var actionOption_id = uniqId();
div += '<div class="col-sm-6 actionOptions" id="'+actionOption_id+'">';
div += '</div>';

div += '</div>';

div += '</div>';
_el.find('.div_spresence').append(div);
_el.find('.div_spresence .spresence:last').setValues(_spresence, '.expressionAttr');

actionOptions.push({
    expression : init(_spresence.cmd, ''),
    options : _spresence.options,
    id : actionOption_id
});
}