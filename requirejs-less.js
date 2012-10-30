define(
    ['require', 'module', 'text', 'less'], 
    function(require, module, text, less){
        // Rewrite paths starting w/ require:
        less.rewritePath = function(path){
            path = path.replace(/^require:(.*)/, function(){
                newPath = require.toUrl(arguments[1]);
                return newPath;
            });
            return path;
        };

        requirejsLess = {
            load: function (name, req, onLoad, config){
                var srcBasePath = req.toUrl(name).replace(/\/[^\/]*$/, '') + '/';
                // Code to execute after less source code is loaded.
                onSrcLoad = function(src){
                    parser = new less.Parser({
                        paths: [srcBasePath],
                        filename: req.toUrl(name)
                    });
                    parser.parse(src, function(err, tree){
                        if (err){
                            onLoad.error("Less error: ", JSON.stringify(err));
                            return;
                        }

                        try {
                            var css = tree.toCSS();
                            onLoad(css);
                            return;
                        }
                        catch (e){
                            onLoad.error("Less error: " + JSON.stringify(e));
                            return;
                        }
                    });
                };

                // Load less source code via text plugin.
                text.load(name, req, onSrcLoad, config);
            },
            normalize: text.normalize
        };
        return requirejsLess;
    }
);

