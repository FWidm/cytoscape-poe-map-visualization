/**
 * Created by Fabian-Desktop on 28.12.2017.
 */



function create_map_node(map) {
    let defaultImg = 'img/icon.png';
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
        position: {x: 2 * map.coordinates.x, y: 2 * map.coordinates.y}

    }];
}

function create_description(map) {
    let mapBaseLevel = 67;
    let bossNames = "";
    map.boss.forEach(function (item) {
        bossNames += item.name + " "
    });
    let defaultImg = 'img/maps/blankMap.png';
//'<img src=' + defaultImg + '>' + '<br/>' +
    return '<b>Tier:</b> ' + map.tier + '<br/>' +
        '<b>Level</b>: ' + (mapBaseLevel + map.tier + '<hr>') +
        '<b>Guild Character</b>: ' + map.guild_character + '<br>' +
        '<b>Boss</b>: ' + bossNames //todo: insert wiki link
        +'<hr>' +
        '<i>'+map.flavour_text + '</i><br>';
}

function create_map_tooltip(map) {
    let descriptionText = create_description(map);
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
            title: '<b>'+map.name+'</b>',
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
