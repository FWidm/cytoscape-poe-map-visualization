let minWidth = 1920;
let minHeight = 1080;

let mapWidth = window.screen.width < minWidth ? minWidth : window.screen.width;
let mapHeight = window.screen.height < minHeight ? minHeight : window.screen.height;
console.log("w:h=" + mapWidth + ":" + mapHeight);
let mapBitSet = new BitSet;
let loadedMaps = [];
document.addEventListener('DOMContentLoaded', function () { // on dom ready

    let i = 0;
    let clicked;
    let searchbarHelpText = "When typing the atlas will highlight all maps that start with your given string.<br/>Special commands:<br/>" +
        "<ul>" +
        "<li><b>unique</b> - highlights unique maps.</li>" +
        "<li><b>shaper orb</b> - highlights maps that contain a shaper's orb.</li>" +
        "<li><b>shaper orb tier: x</b> - highlights all maps that contain a shaper's orb for the specified tier.</li>" +
        "<li><b>tier: x</b> - highlights all maps have the specified map tier.</li>" +
        "</ul>" +
        "<hr>Buttons:" +
        "<ul>" +
        "<li><b>Clear</b> - clears all selected maps</li>" +
        "<li><b>mark as completed</b> - mark highlighted maps.</li>" +
        "</ul>";

    let cy = cytoscape({
        container: document.querySelector('#cy'),

        boxSelectionEnabled: false,
        autounselectify: true,
        autoungrabify: true,

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'text-valign': 'top',
                'text-halign': 'center',
                'color': 'white',
                'text-outline-width': 1,
                'background-opacity': 1,
                'background-color': '#19181a',
                'border-color': '#000',
                'border-width': '1px',
                'text-outline-color': 'black',
                "font-size": 11,
                // 'shape': 'polygon',
                // 'shape-polygon-points': getPolygonMapShape()

            })
            .selector('edge')
            .css({
                'curve-style': 'haystack',
                'line-style': 'dashed',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': 'white',
                'line-color': 'white',
                'line-opacity': .5,
                'opacity': 1,
                'width': 1
            })
            .selector('.uptier')
            .css({
                'curve-style': 'bezier',
                'line-style': 'solid',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': 'white',
                'line-color': 'white',
                'line-opacity': .5,
                'opacity': 1,
                'width': 3
            })
            .selector(':selected')
            .css({
                'background-color': '#232323',
                'background-blacken': 1,
                'line-color': '#232323',
                'target-arrow-color': '#232323',
                'source-arrow-color': '#232323',
                'opacity': 0
            })
            .selector('.shaperOrb')
            .css({
                'border-color': 'violet',
                'border-style': 'double',
                'border-width': '3px'
            })
            .selector('.searchHl')
            .css({
                'border-color': 'teal',
                'border-style': 'double',
                'border-width': '3px'
            })
            .selector('.unique')
            .css({
                'background-image-opacity': 1,
                'opacity': 1,
                'text-opacity': 1,
                'background-color': '#00000000',
                'background-opacity': 0,
                'target-arrow-color': 'gold',
                'line-color': 'gold',
                'border-width': '0px',

            })
            .selector('.highlighted')
            .css({
                'border-color': '#71cc7b',
                'border-style': 'double',
                'border-width': '5px'
            })
            .selector('.faded')
            .css({
                'background-image-opacity': 0.25,
                'opacity': 0.25,
                'text-opacity': 0
            })
            .selector('.whiteMap')
            .css({
                'color': '#fff4f3',

            })
            .selector('.yellowMap')
            .css({
                'color': '#daa919',
            })
            .selector('.redMap')
            .css({
                'color': '#ff5945',

            }),

        layout: {
            name: 'grid',
            padding: 10
        },
        // rendering options:
        headless: false,
        styleEnabled: true,
        hideEdgesOnViewport: false,
        hideLabelsOnViewport: false,
        textureOnViewport: false,
        motionBlur: false,
        motionBlurOpacity: 0.2,
        wheelSensitivity: .05,
        pixelRatio: 'auto',
        minZoom: .3,
        maxZoom: 3
    });


    /**
     * Click/Tap handler on a node
     */
    cy.on('tap', 'node', function (e) {

        let node = e.cyTarget;
        console.log("tap on: [" + e.cyTarget.id() + "| name=+" + e.cyTarget.data('name'));
        clicked = node;

        //let neighborhood = node.outgoers().add(node);
        //cy.elements().addClass('faded');
        //node.removeClass('faded');
        if (node.hasClass('highlighted')) {
            node.removeClass('highlighted');
            loadedMaps[node.id()].selected = false;
            mapBitSet.set(node.id(), 0);

        }
        else {
            node.addClass('highlighted');
            loadedMaps[node.id()].selected = true;
            mapBitSet.set(node.id(), 1);
        }
        encodeMapsToUrl(16);
        console.log(getSelectedMaps().length);
    });

    function getSelectedMaps() {

        return loadedMaps.filter(function (map) {
            return map.selected;
        });
    }

    /**
     * Log node id on mouseover
     */
    cy.on('mouseover', 'node', function (e) {
        //let node = e.cyTarget;
        //console.log(node.id());
    });

    let searchedNodes = [];
    /**
     * Search maps - highlight corresponding maps via the class "searchHl".
     */
    $("#search").on('change keyup paste', function () {
        let inputVal = $("#search").val();
        // console.log("change: " + inputVal);
        let targetNodes = filterNodes(inputVal);
        searchedNodes = targetNodes;

        //console.log(targetNodes.length);
        cy.filter().removeClass('searchHl');
        targetNodes.addClass('searchHl');
    });

    /**
     * Clear the map search input field, remove searchHL class from all nodes
     */
    $("#clear").click(function () {
        cy.filter().removeClass('searchHl');
        $('#search').val("");
    });

    /**
     * Add the last searched maps to the selected list and adapt URL
     */
    $("#selectMaps").click(function () {
        for (let i = 0; i < searchedNodes.length; i++) {
            console.log(searchedNodes[i].id());
            searchedNodes[i].addClass('highlighted');
            loadedMaps[searchedNodes[i].id()].selected = true;
            mapBitSet.set(searchedNodes[i].id(), 1);
        }
        encodeMapsToUrl(16);
    });

    $('#search').qtip({ // Grab some elements to apply the tooltip to
        show: {
            event: 'mouseover',
        },
        hide: {
            event: 'mouseout',
            fixed: true,
            delay: 100
        },
        content: {
            title: "Using the search bar",
            text: searchbarHelpText,
        }, // content: { title: { text: value } }

        position: {
            my: 'bottom left',  // Position my top ...
            at: 'top middle' // at the bottom  of...
        },
        style: {
            classes: 'qtip-bootstrap'
        }
    });

    /**
     * Filters nodes depending on how the entered string starts:
     *  - "unique" is entered   --> highlight unique maps
     *  - "shaper"              --> highlight ALL maps containing a shaper orb
     *  - "shaper tier: x"      --> highlight all maps that drop a shaper orb for tier x
     *  - "tier: x"             --> highlight all maps that have the specific tier x
     *  else
     *  - highlight all maps that start with the entered string
     * @returns list of cytoscape nodes.
     */
    function filterNodes(inputVal) {
        return cy.filter(function (i, element) {
            if (inputVal.toUpperCase().startsWith("UNIQUE")) {
                return element.isNode() && element.data("unique");
            }
            else if (inputVal.toUpperCase().startsWith("SHAPER ORB")) {
                if (inputVal.toUpperCase().startsWith("SHAPER ORB TIER:")) {
                    let tier = parseInt(inputVal.split(":")[1].replace(/ /g, ""));
                    return element.isNode() && element.data("shaperOrbTier") === tier;
                }
                return element.isNode() && element.data("shaperOrbTier") > 0;
            }
            else if (inputVal.toUpperCase().startsWith("TIER:")) {
                let tierNumber = inputVal.split(":")[1].replace(/ /g, "");
                if (element.isNode()) {
                    console.log(element.data("tier"));
                    if (element.data("tier") === parseInt(tierNumber)) {
                        return true;

                    }
                }

            }
            else if (element.isNode() && inputVal !== "" &&
                (element.data("name").toUpperCase().indexOf(inputVal.toUpperCase()) > 0
                || element.data("name").toUpperCase().startsWith(inputVal.toUpperCase()))) {
                return true;
            }
            return false;
        });
    }

    loadMaps();

    /**
     * Load sample data
     */
    function loadMaps() {
        // let div = $('#cy');
        cy.zoom({
            level: 1.2, // the zoom level
        });
        let centeringNodeId = -1;
        $.getJSON('json-prototypes/maps_3_1.json', function (data) {
            // $.getJSON('json-prototypes/atlas-2.6.json', function (data) {
            //data is the JSON string

            //nodes
            for (let id = 0; id < data.length; id++) {
                let map = new Map(id, data[id]);
                loadedMaps.push(map);
                addNode(map);

            }
            //edges
            for (id = 0; id < loadedMaps.length; id++) {
                let map = loadedMaps[id];

                // if(map.unique)
                //     continue;

                if (map.upgrade && !map.unique) {
                    let upgrade = getMapIdByName(map.upgrade,loadedMaps);

                    addUptier("u" + id + "-" + upgrade.id, map.id, upgrade.id)
                }
                if (map.unique) {
                    let base = getMapIdByName(map.base,loadedMaps);
                    addEdge("e"+id+"-"+base.id,id,base.id);
                }
                else if (map.connected_to) {
                    for (key in map.connected_to) {
                        let neighbor = getMapIdByName(map.connected_to[key].name,loadedMaps);

                        if (neighbor.name === "Vaal Temple")
                            continue;

                        addEdge("e" + id + "-" + neighbor.id, map.id, neighbor.id);
                    }
                }
            }

            centeringNodeId = loadedMaps[loadedMaps.length - 1].id;
            console.log("centering @ " + centeringNodeId);
            cy.center("#" + centeringNodeId);
            // $('#cy').css("background-image", "url("+data.atlasBGImage+")");
            mapBitSet.set(loadedMaps.length, 0);
            console.log("Loaded... " + loadedMaps.length + " maps! Bitset=" + mapBitSet.toString());
            setSelectedMapsFromURL();
        });

    }

    function getMapIdByName(name, array){
        console.log(name);
        console.log(array);
        return array.filter(function (el) {
            return name.startsWith(el.name + " Map");
        })[0];
    }
    /**
     * Read the given URL and set the corresponding bits in the bitset.
     */
    function setSelectedMapsFromURL() {
        decodeMapsFromUri();
        console.log("Loading from BitSet: " + mapBitSet.toString());
        console.log("looping through " + loadedMaps.length + " maps.");
        let bitArray = mapBitSet.toArray();
        console.log(bitArray);
        for (i in bitArray) {
            if (i >= loadedMaps.length)
                break;
            loadedMaps[i].selected = true;
            cy.$('#' + bitArray[i]).addClass("highlighted");
        }
    }

    /**
     * add a note to the grid
     * param map class Map
     */
    function addNode(map) {
        //add the node
        cy.add(create_map_node(map));

        //add the tooltip
        let node = cy.getElementById(map.id);
        node.qtip(create_map_tooltip(map));

        //postprocessing the created node by adding corresponding classes.
        styleByTier(node, map.tier);
        if (map.unique)
            node.addClass("unique");

    }

    function styleByTier(node, tier) {
        if (tier < 6) {
            node.addClass("whiteMap");
        }
        else if (tier >= 6 && tier <= 10) {
            node.addClass("yellowMap");
        }
        else {
            node.addClass("redMap");

        }
    }

    /**
     * Add an edge to the graph
     * @param id
     * @param srcId
     * @param targetId
     */
    function addEdge(id, srcId, targetId) {
        cy.add([{
            group: "edges",
            data: {id: id, source: srcId, target: targetId}
        }
        ]);
    }

    /**
     * Adds an uptier edge to the graph
     * @param id
     * @param srcId
     * @param targetId
     */
    function addUptier(id, srcId, targetId) {
        elem = cy.add([{
            group: "edges",
            data: {id: id, source: srcId, target: targetId}
        }
        ]);
        elem.addClass("uptier");
        // cy.$('#' + id).addClass("uptier");
    }

    /**
     * Creates the new map shape of poe as polygon.
     * @returns {string}
     */
    function getPolygonMapShape() {
        return '-.65, -.9' + //line top
            ',  -.65, -.9.5' +
            ',  0, -1' +
            ',  .65, -.95' +
            ',  .65, -.9' +
            //spike upper right
            ',  .55, -.65' +
            ',  .7, -.7' +
            ',  .65, -.55' +
            //line right
            ',  .9, -.65' +
            ',  .95, -.65' +
            ',  1, 0' +
            ',  .95, .65' +
            ',  .9, .65' +
            //spike r bott
            ',  .65, .55' +
            ',  .7, .7' +
            ',  .55, .65' +

            //line bottom
            ',  .65, .9' +
            ',  .65, .95' +
            ',  0, 1' +
            ',  -.65, .95' +
            ',  -.65, .9' +
            //spike left bottom
            ',  -.55, .65' +
            ',  -.7, .7' +
            ',  -.65, .55' +
            //line left
            ',  -.9, .65' +
            ',  -.95, .65' +
            ',  -1, 0' +
            ',  -.95, -.65' +
            ',  -.9, -.65' +
            //topleft
            ',  -.65, -.55' +
            ',  -.7, -.7' +
            ',  -.55, -.65';
    }
}); // on dom ready

