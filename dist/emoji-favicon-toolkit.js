var set_emoji_favicon = (function () {
    var is_worker = !self.document;
    var mime_image = 'image/png';
    if (is_worker) {
        // Assume we are running in a service worker.
        // Constants
        var cache_name_1 = 'favicon-cache';
        var favicon_uri_1 = '/favicon.ico';
        self.addEventListener('message', function (event) {
            var array_buffer = event.data;
            var faviconRequest = new Request(favicon_uri_1);
            var faviconResponse = new Response(array_buffer, {
                headers: {
                    "Content-Type": mime_image,
                    "Content-Length": String(array_buffer.byteLength)
                }
            });
            caches.open(cache_name_1).then(function (cache) {
                cache.put(faviconRequest, faviconResponse);
            });
        });
        self.addEventListener('fetch', function (event) {
            event.respondWith(caches.open(cache_name_1).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    if (response) {
                        // Return the favicon stored in the cache
                        return response;
                    }
                    else {
                        // Perform an actual request to the server
                        return fetch(event.request);
                    }
                });
            }));
        });
    }
    else {
        // Assume we are running in the browser.
        // Window load promise
        var window_load_1 = new Promise(function (resolve) {
            window.addEventListener('load', resolve);
        });
        // Constants
        var ns = 'http://www.w3.org/1999/xhtml';
        var mime_text_regex_1 = /^\s*(?:text\/plain)\s*(?:$|;)/i;
        var size_1 = 256; // Anything larger will causes problems in Google Chrome
        var pixelgrid_1 = 16;
        var self_uri_1 = document.currentScript.getAttribute('src');
        var service_worker_container_1 = navigator.serviceWorker;
        // Elements
        var canvas_1 = document.createElementNS(ns, 'canvas');
        var link_1 = document.createElementNS(ns, 'link');
        var context_1 = canvas_1.getContext('2d');
        // Canvas setup
        canvas_1.width = canvas_1.height = size_1;
        context_1.font = "normal normal normal " + size_1 + "px/" + size_1 + "px sans-serif";
        context_1.textAlign = 'center';
        context_1.textBaseline = 'middle';
        // Link setup
        link_1.rel = 'icon';
        link_1.type = mime_image;
        link_1.setAttribute('sizes', size_1 + "x" + size_1);
        // Scan document for statically-defined favicons
        var lastlink = [].slice.call(document.getElementsByTagNameNS(ns, 'link'), 0).filter(function (link) {
            return link.rel.toLowerCase() === 'icon' && mime_text_regex_1.test(link.type);
        }).pop();
        if (lastlink) {
            var xhr_1 = new XMLHttpRequest;
            var uri = lastlink.href.trim().replace(/^data:(;base64)?,/, "data:text/plain;charset=utf-8$1,");
            xhr_1.open('GET', uri);
            xhr_1.addEventListener('load', function () {
                if (xhr_1.readyState === xhr_1.DONE && xhr_1.status === 200) {
                    var emoji = xhr_1.responseText;
                    set_emoji_favicon(emoji, false);
                }
            });
            xhr_1.send();
        }
        function set_emoji_favicon(emoji, cacheWithServiceWorker) {
            // Normalize arguments
            var char = String(emoji) || '';
            var cache = Boolean(cacheWithServiceWorker);
            // Calculate sizing
            var metric = context_1.measureText(char);
            var iconsize = metric.width;
            var center = (size_1 + size_1 / pixelgrid_1) / 2;
            var scale = Math.min(size_1 / iconsize, 1);
            var center_scaled = center / scale;
            // Draw emoji
            context_1.clearRect(0, 0, size_1, size_1);
            context_1.save();
            context_1.scale(scale, scale);
            context_1.fillText(char, center_scaled, center_scaled);
            context_1.restore();
            // Update favicon element
            link_1.href = canvas_1.toDataURL(mime_image);
            document.getElementsByTagName('head')[0].appendChild(link_1);
            // Add favicon to cache
            if (cache && service_worker_container_1) {
                canvas_1.toBlob(function (blob) {
                    var reader = new FileReader();
                    reader.addEventListener('loadend', function () {
                        var array_buffer = reader.result;
                        // https://developers.google.com/web/fundamentals/primers/service-workers/registration
                        window_load_1.then(function () {
                            service_worker_container_1.register(self_uri_1, { scope: '/' });
                            service_worker_container_1.ready.then(function (registration) {
                                // https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast
                                registration.active.postMessage(array_buffer, [array_buffer]);
                            });
                        });
                    });
                    reader.readAsArrayBuffer(blob);
                }, mime_image);
            }
        }
        return set_emoji_favicon;
    }
})();
