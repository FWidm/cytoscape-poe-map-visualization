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
    let mapBaseLevel = 67;
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
                'background-opacity': 0,
                'text-outline-color': 'black',
                "font-size": 11
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
                'background-blacken':1,
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
            // console.log("map="+map);
            return map.selected;
        });
    }

    /*
     /!**
     * General click/tab handler
     *!/
     cy.on('tap', function (e) {
     console.log("tap on target:");
     console.log(e.cyTarget);
     // if (e.cyTarget === cy) {
     //     cy.elements().removeClass('faded');
     // }

     });*/

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

    $('#buttons').qtip({ // Grab some elements to apply the tooltip to
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
        $.getJSON('json-prototypes/atlas-2.6.json', function (data) {
            //data is the JSON string

            //nodes
            for (let id = 0; id < data.maps.length; id++) {
                //console.log(data.maps[id]);
                let map = data.maps[id];
                let posX = mapWidth * map.posX;
                let posY = mapHeight * map.posY;
                //console.log(id+" | n="+map.name);
                let img = map.imageUrl;

                let selected = false;
                loadedMaps.push(new Map(map.mapId, map.tier, map.name, map.posX, map.posY, img, map.shaperOrb, selected));
                addNode(map.mapId, map.name, map.tier, img, posX, posY, map.unique, map.shaperOrb);

            }
            //edges
            for (id = 0; id < data.maps.length; id++) {
                let map = data.maps[id];

                if (map.upgradesTo !== undefined) {
                    console.log("upgradesTo: " + map.upgradesTo.mapId);

                    addUptier("u" + id + "-" + map.upgradesTo.mapId, map.mapId, map.upgradesTo.mapId)
                }

                if (map.connections !== undefined) {
                    for (conn  in map.connections) {
                        addEdge("e" + id + "-" + map.connections[conn].mapId, map.connections[conn].mapId, map.mapId);
                    }
                }
            }
            i = data.maps.length - 1;
            centeringNodeId = data.maps[i].mapId;
            console.log("centering @ " + centeringNodeId);
            cy.center("#" + centeringNodeId);
            // $('#cy').css("background-image", "url("+data.atlasBGImage+")");
            mapBitSet.set(loadedMaps.length, 0);
            console.log("Loaded... " + loadedMaps.length + " maps! Bitset=" + mapBitSet.toString());
            setSelectedMapsFromURL();
        });

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
     * @param id - id of the map
     * @param name - name of the map
     * @param tier
     * @param img - img of the node
     * @param posX - posY relative to the screen
     * @param posY - posX relative to the screen
     * @param unique - is the map unique
     * @param shaperOrb
     */
    function addNode(id, name, tier, img, posX, posY, unique, shaperOrb) {
        let defaultImg='img/maps/blankMap.png';
        if(img===undefined){
            img = defaultImg
        }
        let shaperOrbTier = 0;
        let descriptionText = '<img src=' + img + '>' + '<br/>' +
            '<hr> Tier: ' + tier + '<br/>' +
            'Level: ' + (mapBaseLevel + tier + '<hr>');
        if (shaperOrb !== undefined) {
            descriptionText += 'Shaper Orb: Tier ' + shaperOrb.targetTier + ' maps.<hr>';
            if (shaperOrb.targetTier !== null) {
                shaperOrbTier = shaperOrb.targetTier;
            }
        }

        //add the node
        cy.add([{
            group: "nodes",

            data: {
                id: id,
                name: name,
                tier: tier,
                unique: unique,
                shaperOrbTier: shaperOrbTier
            },
            style: {
                'background-image': img,
                'background-width': '100%',
                'background-height': '100%'
            },
            position: {x: posX, y: posY}

        }]);

        //add the tooltip
        cy.$('#' + id).qtip({
            show: {
                event: 'mouseover', // cxttap = double finger touch or right click.
                solo: true
            },
            hide: {
                event: 'mouseout',
                fixed: true,
                delay: 100
            },
            content: {
                title: name,
                text: descriptionText,
            }, // content: { title: { text: value } }

            position: {
                my: 'bottom center',  // Position my top left...
                at: 'top center' // at the bottom right of...
            },
            style: {
                classes: 'qtip-bootstrap'
            }
        });

        //postprocessing the created node by adding corresponding classes.

        styleByTier(id, tier);
        if (unique)
            cy.$('#' + id).addClass("unique");
        if (shaperOrb !== undefined)
            cy.$('#' + id).addClass("shaperOrb");
    }

    function styleByTier(id, tier) {
        let mapNode = cy.$('#'+id);
        if(tier<6){
            mapNode.addClass("whiteMap");
        }
        else if(tier>=6&&tier<=10){
            mapNode.addClass("yellowMap");
        }
        else {
            mapNode.addClass("redMap");

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
        cy.add([{
            group: "edges",
            data: {id: id, source: srcId, target: targetId}
        }
        ]);
        cy.$('#' + id).addClass("uptier");
    }
}); // on dom ready

