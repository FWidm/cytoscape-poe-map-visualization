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
                'text-outline-color': '#333',
            })
            .selector('edge')
            .css({
                'curve-style': 'bezier',
                'line-style':'dotted',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': 'ivory',
                'line-color': 'ivory',
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
            .selector('.highlighted')
            .css({
                'background-image-opacity': 1,
                'opacity': 1,
                'text-opacity': 1,
                'background-color': 'gold',
                'color': 'gold',
                'target-arrow-color': 'gold',
                'line-color': 'gold',
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
        }
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
        let node = e.cyTarget;
        console.log(node.id());
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
        // T1
        let map={name:"Crystal Ore",tier:1,posX:0.18193717277486768,posY: 0.14764397905759163};
        let div=$('#cy');
        let posX=div.width()*map.posX;
        let posY=div.height()*map.posY;
        console.log("posX="+posX+", posY="+posY);
        addNode(0,map.name,'img/maps/blankMap.png',posX,posY);
        map=    {name:"Factory", tier:2,posX:0.177814136125653,posY:0.2418848167539267};
        posX=div.width()*map.posX;
        posY=div.height()*map.posY;
        console.log("posX="+posX+", posY="+posY);
        addNode(1,map.name,'img/maps/blankMap.png',posX,posY);
        addEdge("e0",0,1);
        map={name:"Channel", tier:3, posX:0.20785340314135994, posY:0.30261780104712044};
        posX=div.width()*map.posX;
        posY=div.height()*map.posY;
        console.log("posX="+posX+", posY="+posY);
        addNode(2,map.name,'img/maps/blankMap.png',posX,posY);
        addEdge("e1",1,2);

        map={name:"Cavern",tier: 3, posX:0.18134816753926558,posY:0.42094240837696334};
        posX=div.width()*map.posX;
        posY=div.height()*map.posY;
        console.log("posX="+posX+", posY="+posY);
        addNode(3,map.name,'img/maps/blankMap.png',posX,posY);
        addEdge("e2",1,3);
        i=4;

    }

    /**
     * add a note to the grid
     * @param id
     * @param name
     * @param img
     * @param posX
     * @param posY
     */
    function addNode(id, name, img, posX, posY) {
        cy.add([{
            group: "nodes",

            data: {
                id: id,
                name: name
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
                event: 'mouseover'
            },
            hide: {
                event: 'mouseout'
            },
            content: {
                title: name,
                text: '<img src='+img+'>' + '<br/><hr> Additional Info: ' + i + '<br/> Second line'
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