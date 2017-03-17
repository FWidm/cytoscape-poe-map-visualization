document.addEventListener('DOMContentLoaded', function () { // on dom ready

    var i = 0;
    var clicked;

    class Rectangle {
        constructor(height, width) {
            this.height = height;
            this.width = width;
        }
    }

    var cy = cytoscape({
        container: document.querySelector('#cy'),

        boxSelectionEnabled: false,
        autounselectify: true,

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'text-valign': 'top',
                'color': 'white',
                'text-outline-width': 2,
                'background-color': '#333',
                'text-outline-color': '#333'
            })
            .selector('edge')
            .css({
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': '#ccc',
                'line-color': '#ccc',
                'width': 1
            })
            .selector(':selected')
            .css({
                'background-color': 'black',
                'line-color': 'black',
                'target-arrow-color': 'black',
                'source-arrow-color': 'black'
            })
            .selector('.faded')
            .css({
                'background-image-opacity':0.25,
                'opacity': 0.25,
                'text-opacity': 0
            }),

        layout: {
            name: 'grid',
            padding: 10
        }
    });

    cy.on('tap', 'node', function (e) {

        var node = e.cyTarget;
        console.log("tap on: [" + e.cyTarget.id() + "| name=+" + e.cyTarget.data('name'));
        clicked = node;

        var neighborhood = node.neighborhood().add(node);

        cy.elements().addClass('faded');
        node.removeClass('faded');
    });

    cy.on('tap', function (e) {
        console.log();
        if (e.cyTarget === cy) {
            cy.elements().removeClass('faded');
        }
    });


    $("#randomize").click(function () {
        var layout = cy.makeLayout({
            name: 'random'
        });

        layout.run();
    });

    $("#add").click(function () {
        cy.add([{
            group: "nodes",

            data: {
                id: i,
                class: "map",
                name: 'Add-' + i
            },
            style:{
                'background-image':'img/maps/blankMap.png',
                'background-width':'100%',
                'background-height':'100%'
            },
            position: {x: 200, y: 200}

        },
            {group: "edges", data: {id: "e" + i, source: i, target: i - 1}}
        ]);

        cy.$('#' + i).qtip({
            content: {
                title: 'Add-' + i,
                text: '<img src="img/maps/blankMap.png"' + i + '<br/><hr> Additional Info: '+i+'<br/> Second line'
            }, // content: { title: { text: value } }

            position: {
                my: 'top center',
                at: 'top center'
            },
            style: {
                classes: 'qtip-bootstrap',
                tip: {
                    width: 16,
                    height: 8
                }
            }
        });

        i++;

    });
}); // on dom ready

