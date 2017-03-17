document.addEventListener('DOMContentLoaded', function () { // on dom ready

    let i = 0;
    let clicked;

    class Map {
        constructor(id, tier, name, posX, posY) {
            this.id=id;
            this.tier=tier;
            this.name=name;
            this.posX=posX;
            this.posY=posY;
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
                'background-color': 'black',
                'text-outline-color': 'black',
                "font-size":11
            })
            .selector('edge')
            .css({
                'curve-style': 'bezier',
                // 'line-style':'dashed',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': 'ivory',
                'line-color': 'ivory',
                'line-opacity':.5,
                'opacity':.5,
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

        let neighborhood = node.outgoers().add(node);
        cy.elements().addClass('faded');
        node.removeClass('faded');
        neighborhood.addClass('highlighted');
    });

    /**
     * General click/tab handler
     */
    cy.on('tap', function (e) {
        console.log();
        if (e.cyTarget === cy) {
            cy.elements().removeClass('faded');
            cy.elements().removeClass('highlighted');
        }

    });

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
            data: {id: "e" + (i-1), source: (i-1), target: (i-2)}}
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
                at: 'top center'
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
        let div=$('#cy');

        $.getJSON('json-prototypes/atlas-2.6.json', function(data) {
            //data is the JSON string
            //console.log(data);
            console.log(data.maps[data.maps.length-1]);
            for(id=0; id<data.maps.length; id++){
                //console.log(data.maps[id]);
                let map=data.maps[id];
                let posX=div.width()*map.posX;
                let posY=div.height()*map.posY;
                //console.log(id+" | n="+map.name);
                addNode(map.mapId,map.name,'img/maps/blankMap.png',posX,posY,map.unique);
                if(map.parents != undefined){
                    for (parent in map.parents){
                        addEdge(id+"-"+map.parents[parent].mapId,map.parents[parent].mapId,map.mapId);
                    }
                }
            }
        });
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
    function addNode(id, name, img, posX, posY,unique) {
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
        if(unique)
            cy.$('#' + id).addClass("unique");
        cy.$('#' + id).qtip({
            // show: {
            //     event: 'mouseover'
            // },
            // hide: {
            //     event: 'mouseout'
            // },
            content: {
                title: name,
                text: '<img src='+img+'>' + '<br/><hr> Additional Info: ' + id + '<br/> Second line'
            }, // content: { title: { text: value } }

            position: {
                my: 'top center',
                at: 'top center'
            },
            style: {
                classes: 'qtip-dark',
                tip: {
                    width: 16,
                    height: 8
                }
            }
        });
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
            data: {id: id, source: srcId, target: targetId}}
        ]);
    }
}); // on dom ready