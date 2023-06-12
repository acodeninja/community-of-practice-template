document$.subscribe(function () {
    loadScripts()
        .then(renderDiagrams)
        .then(injectDiagrams);
});

function loadScripts() {
    var mermaidScript = document.createElement('script');
    mermaidScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/mermaid@10.2.3/dist/mermaid.min.js');
    document.body.appendChild(mermaidScript);

    return new Promise(waitForMermaidScript);
}

function waitForMermaidScript(resolve) {
    if (window.mermaid !== undefined) return resolve();
    setTimeout(waitForMermaidScript.bind(this, resolve), 100);
}

function renderDiagrams() {
    var mermaidElements = document.getElementsByClassName('mermaid-diagram');
    var diagrams = new Array(mermaidElements.length)
        .fill(true)
        .map(function (_, index) {
            var root = mermaidElements.item(index);
            return {index, root, content: root.firstElementChild.innerText};
        });

    return Promise.all(diagrams.map(function (diagram) {
        return renderDiagram(diagram);
    }));
}

function renderDiagram(diagram) {
    return new Promise(function (resolve, reject) {
        window.mermaid.render(
            `diagram-${diagram.index}`,
            diagram.content,
        ).then(function (rendered) {
            diagram.svg = rendered.svg;
            resolve(diagram);
        });
    });
}

function injectDiagrams(diagrams) {
    diagrams.forEach(function (diagram) {
        var controls = document.createElement('div');
        controls.classList.add('controls');
        controls.innerHTML = `
        <button class="md-raised md-button md-button--primary controls-reset">
            Reset
        </button>
        <button class="md-raised md-button md-button--primary controls-close">
            Close
        </button>`;

        var element = document.createElement('div');
        var zoomed = false;
        element.innerHTML = diagram.svg;
        element.appendChild(controls);
        element.classList.add('mermaid-render');

        diagram.root.classList.add('mermaid-rendered');
        diagram.root.parentNode.insertBefore(element, diagram.root);

        var svg = element
            .getElementsByTagName('svg')
            .item(0);

        var point = svg.createSVGPoint();
        var viewBox = svg.viewBox.baseVal;
        var defaultSettings = {
            viewBox: {
                x: viewBox.x,
                y: viewBox.y,
                width: viewBox.width,
                height: viewBox.height,
            },
        };

        function reset (ev) {
            viewBox.x = defaultSettings.viewBox.x;
            viewBox.y = defaultSettings.viewBox.y;
            viewBox.width = defaultSettings.viewBox.width;
            viewBox.height = defaultSettings.viewBox.height;
            return false;
        }

        controls
            .getElementsByClassName('controls-close')
            .item(0)
            .onclick =
            function (ev) {
                zoomed = false;
                element.classList.remove('mermaid-zoom-modal');
                reset();
                return false;
            }

        svg.onclick = function () {
            if (!zoomed) {
                zoomed = true;
                element.classList.add('mermaid-zoom-modal');
            }
        }

        controls
            .getElementsByClassName('controls-reset')
            .item(0)
            .onclick = reset;

        element.onwheel = function (ev) {
            if (!zoomed) return;

            var zoomIn = (ev.wheelDelta || ev.deltaY || ev.detail || 0) > 0;
            point.x = ev.clientX;
            point.y = ev.clientY;

            var startingPoint = point.matrixTransform(svg.getScreenCTM().inverse());
            var scaleDelta = zoomIn ? 1 / 1.6 : 1.6;

            viewBox.x -= (startingPoint.x - viewBox.x) * (scaleDelta - 1);
            viewBox.y -= (startingPoint.y - viewBox.y) * (scaleDelta - 1);
            viewBox.width *= scaleDelta;
            viewBox.height *= scaleDelta;

            return false;
        }
    });
}
