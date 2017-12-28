/**
 * Created by Fabian-Desktop on 28.12.2017.
 */
function create_map_node(map) {
    let defaultImg='img/maps/blankMap.png';
    return [{
        group: "nodes",

        data: {
            id: map.id,
            name: map.name,
            tier: map.tier,
            unique: map.unique,
        },
        style: {
            'background-image': defaultImg,
            'background-width': '100%',
            'background-height': '100%'
        },
        position: {x: 2*map.coordinates.x, y: 2*map.coordinates.y}

    }];
}

function create_map_tooltip(map) {
    let mapBaseLevel = 67;
    let defaultImg='img/maps/blankMap.png';

    let descriptionText = '<img src=' + defaultImg + '>' + '<br/>' +
        '<hr> Tier: ' + map.tier + '<br/>' +
        'Level: ' + (mapBaseLevel + map.tier + '<hr>');
    return {
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
            title: map.name,
            text: descriptionText,
        }, // content: { title: { text: value } }

        position: {
            my: 'bottom center',  // Position my top left...
            at: 'top center' // at the bottom right of...
        },
        style: {
            classes: 'qtip-bootstrap'
        }
    };
}
