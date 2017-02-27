define(['text'], function (text) {

    'use strict';

    var buildMap = {};

    return {
        load: function (name, req, onLoad, config) {
            if (config.isBuild && ((req.toUrl(name).indexOf('empty:') === 0) || (req.toUrl(name).indexOf('http:') === 0) || (req.toUrl(name).indexOf('https:') === 0))) {
                var path = config.config.services[name] + '.service';

                text.get(req.toUrl(path), function(data) {
                    buildMap[name] = data;
                    onLoad(data);
                });
            } else {
                var path = config.config.services[name] + '.service';
                req([path], function(value) {
                    onLoad(value);
                }, function(e) {
                    onLoad.error(e);
                })
            }
        },
        write : function(pluginName, moduleName, write){
            if (moduleName in buildMap){
                var content = buildMap[moduleName];
                write('define("'+ pluginName +'!'+ moduleName +'", function(){ return '+ content +';});\n');
            }
        }
    }
});
