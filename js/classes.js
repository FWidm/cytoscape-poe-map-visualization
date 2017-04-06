/**
 * Created by Fabian-Desktop on 06.04.2017.
 */
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