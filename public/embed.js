(function () {
    var d = document;
    var w = window;

    var SCRIPT_SRC = document.currentScript ? document.currentScript.src : 'http://localhost:3000/embed.js';
    var BOT_URL = SCRIPT_SRC.replace('/embed.js', '');

    var iframe = d.createElement('iframe');
    iframe.src = BOT_URL;
    iframe.style.position = 'fixed';
    // Start off small: just enough for the launcher bubble in the bottom right corner
    iframe.style.width = '120px';
    iframe.style.height = '120px';
    iframe.style.bottom = '0';
    iframe.style.right = '0';

    // Important overrides so the iframe background is strictly transparent over the parent page
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    iframe.style.backgroundColor = 'transparent';
    iframe.allowTransparency = 'true';
    iframe.style.transition = 'width 0.3s ease, height 0.3s ease';

    iframe.setAttribute('title', 'Assistente ULSS 9');

    d.body.appendChild(iframe);

    w.addEventListener('message', function (e) {
        // Only accept postMessages coming from our known widget domain.
        // In production we would check e.origin === BOT_URL origin.
        if (e.data && e.data.type === 'CHATBOT_RESIZE') {
            if (e.data.isOpen) {
                // Chat is open, make iframe large enough to accommodate the full chat window
                // The widget itself has max constraints inside its own UI, but we must give iframe the space.
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                if (w.innerWidth >= 640) {
                    // Desktop sizes
                    iframe.style.width = '450px';
                    iframe.style.height = '700px';
                }
            } else {
                // Chat is closed, shrink back to just the launcher bubble bounds to allow clicking on host site
                iframe.style.width = '180px';
                iframe.style.height = '140px';
            }
        }
    });

})();
