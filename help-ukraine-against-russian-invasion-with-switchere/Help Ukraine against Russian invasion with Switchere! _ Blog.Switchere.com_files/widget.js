;(function(w) {
    var urlBaseDefault = 'https://switchere.com';
    var ERROR_MSG_LOAD = 'Error widget init! Script can\'t load.';

    w.initSwitchere = function initSwitchere(selector, params) {
        var extConf    = w.SWITCHERE_CONFIG || {};
        var urlBase    = extConf.urlBase || urlBaseDefault;
        var scriptPath = '/js/sw-widget-init.js';
        var URL        = urlBase + scriptPath;
        var revision;

        return getRevision()
            .then(function(res) {
                revision = res;

                return appendScript(URL + '?' + res);
            })
            .then(function() {
                if (!w.SWITCHERE) {
                    console.error(ERROR_MSG_LOAD);

                    return;
                }

                w.SWITCHERE.revision = revision;
                w.SWITCHERE.init(selector, params);
            })
            .catch(function(err) {
                console.error(ERROR_MSG_LOAD);
                console.error(err);
            });
    };

    function getRevision() {
        var extConf = w.SWITCHERE_CONFIG || {};
        var ERROR_MSG_REVISION = 'Error widget init! Script revision can\'t load.';

        return new Promise( function(resolve, reject) {
            var url = (extConf.urlBase || urlBaseDefault) + '/widget/revision';
            var xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);

            xhr.onload = function() {
                if ( this.status === 200 ) {
                    var res      = JSON.parse(xhr.responseText);
                    var revision = res.revision;

                    extConf.debug && console.log('xhr.responseText', this.responseText);

                    if (!revision) {
                        console.error(ERROR_MSG_REVISION);

                        reject( this );
                    }

                    extConf.debug && console.log('Script revision: ', revision);

                    return resolve( revision );
                }

                console.error(ERROR_MSG_REVISION);

                return reject( this );
            };

            xhr.onerror = function() {
                console.error(ERROR_MSG_REVISION);

                return reject(this.status);
            };

            xhr.send();
        } );
    }

    function appendScript(src) {
        return new Promise( function(resolve, reject) {
            var script;

            if ( document.querySelector('[src="' + src + '"]') ) {
                return resolve();
            }

            script         = document.createElement('script');
            script.src     = src;
            script.async   = false;
            script.onload  = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        } );
    }
})(window);
