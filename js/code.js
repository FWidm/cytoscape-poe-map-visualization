let mapWidth = window.screen.width;
let mapHeight = window.screen.height;
let mapBitSet = new BitSet;
let loadedMaps = [];

document.addEventListener('DOMContentLoaded', function () { // on dom ready

    let i = 0;
    let clicked;
    let mapBaseLevel = 67;



    class Map {
        constructor(id, tier, name, posX, posY, img, shaperOrb, selected) {
            //maps.push(new Map(map.mapId,map.tier,map.name,map.posX,map.posY,null,map.shaperOrb,false));

            this.id = id;
            this.tier = tier;
            this.name = name;
            this.posX = posX;
            this.posY = posY;
            this.img = img;
            this.selected = selected;
            this.shaperOrb = shaperOrb;
        }

        toString() {
            return "[id=" + this.id + ", name=" + this.name + ", tier=" + this.tier + ", selected=" + this.selected + "]";
        }
    }

    let cy = cytoscape({
        container: document.querySelector('#cy'),

        boxSelectionEnabled: false,
        autounselectify: true,
        autoungrabify: true,

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'text-valign': 'center',
                'color': 'white',
                'text-outline-width': 1,
                'background-color': 'transparent',
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
                'line-color': '#232323',
                'target-arrow-color': '#232323',
                'source-arrow-color': '#232323',
                'opacity': 1
            })
            .selector('.shaperOrb')
            .css({
                'border-color': 'violet',
                'border-style': 'double',
                'border-width': '3px'
            })
            .selector('.unique')
            .css({
                'background-image-opacity': 1,
                'opacity': 1,
                'text-opacity': 1,
                'background-color': 'gold',
                'color': 'gold',
                'target-arrow-color': 'gold',
                'line-color': 'gold',
            })
            .selector('.highlighted')
            .css({
                'background-image-opacity': 1,
                'opacity': 1,
                'text-opacity': 1,
                'background-color': 'red',
                'color': 'red',
                'target-arrow-color': 'red',
                'line-color': 'red',
            })
            .selector('.faded')
            .css({
                'background-image-opacity': 0.25,
                'opacity': 0.25,
                'text-opacity': 0
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
        wheelSensitivity: .15,
        pixelRatio: 'auto'
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
            //todo: add to remembered list
            loadedMaps[node.id()].selected = false;
            mapBitSet.set(node.id(), 0);

        }
        else {
            node.addClass('highlighted');
            //todo: remove from remembered list
            loadedMaps[node.id()].selected = true;
            mapBitSet.set(node.id(), 1);
        }
        encodeMapsToUrl(16);
        console.log(getSelectedMaps().length);
    });

    function getSelectedMaps() {
        let selectedMaps = loadedMaps.filter(function (map) {
            // console.log("map="+map);
            return map.selected;
        });
        return selectedMaps;
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

    /**
     * Handle randomize button
     */
    $("#randomize").click(function () {
        let layout = cy.makeLayout({
            name: 'random'
        });

        layout.run();
    });

    /**
     * handle connect button
     */
    $("#connect").click(function () {
        console.log(i);
        cy.add([{
            group: "edges",
            data: {id: "e" + (i - 1), source: (i - 1), target: (i - 2)}
        }
        ]);
    });


    /**
     * handle addNode button
     */
    $("#addNode").click(function () {
        cy.add([{
            group: "nodes",

            data: {
                id: i,
                class: "map",
                name: 'Add-' + i
            },
            style: {
                'background-image': 'img/maps/blankMap.png',
                'background-width': '100%',
                'background-height': '100%'
            },
            position: {x: 200, y: 200}

        }]);

        cy.$('#' + i).qtip({
            content: {
                title: 'Add-' + i,
                text: '<img src="img/maps/blankMap.png">' + i + '<br/><hr> Additional Info: ' + i + '<br/> Second line'
            }, // content: { title: { text: value } }

            position: {
                my: 'top center',
                at: 'bottom center'
            },
            style: {
                classes: 'qtip-dark',
                tip: {
                    width: 16,
                    height: 8
                }
            }
        });

        i++;

    });

    loadMaps();
    /**
     * Load sample data
     */
    function loadMaps() {
        let div = $('#cy');
        cy.zoom({
            level: 1.2, // the zoom level
        });
        let centeringNodeId = -1;
        $.getJSON('json-prototypes/atlas-2.6.json', function (data) {
            //data is the JSON string
            //console.log(data);

            //nodes
            for (id = 0; id < data.maps.length; id++) {
                //console.log(data.maps[id]);
                let map = data.maps[id];
                let posX = mapWidth * map.posX;
                let posY = mapHeight * map.posY;
                //console.log(id+" | n="+map.name);
                let img = 'img/maps/blankMap.png';
                loadedMaps.push(new Map(map.mapId, map.tier, map.name, map.posX, map.posY, img, map.shaperOrb, false));
                addNode(map.mapId, map.name, map.tier, img, posX, posY, map.unique, map.shaperOrb);

            }
            //edges
            for (id = 0; id < data.maps.length; id++) {
                let map = data.maps[id];

                if (map.upgradesTo != undefined) {
                    console.log("upgradesTo: " + map.upgradesTo.mapId);

                    addUptier("u" + id + "-" + map.upgradesTo.mapId, map.mapId, map.upgradesTo.mapId)
                }

                if (map.connections != undefined) {
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

    function setSelectedMapsFromURL() {
        decodeMapsFromUri();
        console.log("Loading from BitSet: " + mapBitSet.toString());
        console.log("looping through "+loadedMaps.length+" maps.");
        let bitArray = mapBitSet.toArray();
        console.log(bitArray);
        for(i in bitArray){
            if(i>=loadedMaps.length)
                break;
            loadedMaps[i].selected=true;
            cy.$('#' + bitArray[i]).addClass("highlighted");
        }
    }

    /**
     * add a note to the grid
     * @param id - id of the map
     * @param name - name of the map
     * @param img - img of the node
     * @param posX - posY relative to the screen
     * @param posY - posX relative to the screen
     * @param unique - is the map unique
     */
    function addNode(id, name, tier, img, posX, posY, unique, shaperOrb) {
        let descriptionText = '<img src=' + img + '>' + '<br/>' +
            '<hr> Tier: ' + tier + '<br/>' +
            'Level: ' + (mapBaseLevel + tier + '<hr>');
        if (shaperOrb != undefined)
            descriptionText += 'Shaper Orb: Tier ' + shaperOrb.targetTier + ' maps.<hr>';
        cy.add([{
            group: "nodes",

            data: {
                id: id,
                name: name,
            },
            style: {
                'background-image': img,
                'background-width': '100%',
                'background-height': '100%'
            },
            position: {x: posX, y: posY}

        }]);
        cy.$('#' + id).qtip({
            show: {
                event: 'mouseover' // cxttap = double finger touch or right click.
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
        if (unique)
            cy.$('#' + id).addClass("unique");
        if (shaperOrb != undefined)
            cy.$('#' + id).addClass("shaperOrb");
    }

    /**
     * Add an edge to the grid
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

    function addUptier(id, srcId, targetId) {
        cy.add([{
            group: "edges",
            data: {id: id, source: srcId, target: targetId}
        }
        ]);
        cy.$('#' + id).addClass("uptier");
    }
}); // on dom ready

