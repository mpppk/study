function initializeReveal(baseUrl){
    // More info https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
        history: true,

        // More info https://github.com/hakimel/reveal.js#dependencies
        dependencies: [{
            src: baseUrl + '/plugin/markdown/marked.js'
        }, {
            src: baseUrl + '/plugin/markdown/markdown.js'
        }, {
            src: baseUrl + '/plugin/notes/notes.js',
            async: true
        }, {
            src: baseUrl + '/plugin/highlight/highlight.js',
            async: true,
            callback: function() {
                hljs.initHighlightingOnLoad();
            }
        }]
    });
}
