/**
 * Created by Fabian-Desktop on 06.04.2017.
 *         "base": "Beach Map",
 "name": "Beach Map",
 "tier": 1,
 "guild_character": "X",
 "unique": false,
 "upgrade": "Desert Map",
 "connected_to": [
 {
     "Name": "Desert Map"
 },
 {
     "Name": "Arid Lake Map"
 }
 ],
 "flavour_text": "A paradise, forever replenished by endless waves teeming with life.",
 "boss": [
 {
     "Name": "Glace"
 }
 ],
 "coordinates": {
            "y": 95.5199966430664,
            "x": 834.9710083007812
        }
 */
class Map {
    constructor(id, json, selected = false) {
        //maps.push(new Map(map.mapId,map.tier,map.name,map.posX,map.posY,null,map.shaperOrb,false));
        this.id=id;
        this.name = json.name;
        this.tier = json.tier;
        this.guild_character = json.guild_character;
        this.unique = json.unique;
        this.upgrade = json.upgrade;
        this.connected_to = json.connected_to;
        this.flavour_text = json.flavour_text;
        this.boss = json.boss;
        this.coordinates = json.coordinates;
        this.selected = selected;
    }

    toString() {
        return "[id="+id+", name=" + this.name + ", tier=" + this.tier + ", selected=" + this.selected + "]";
    }
}