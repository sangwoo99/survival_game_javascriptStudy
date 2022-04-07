import Player from './Player.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        Player.preload(this); // this는 인스턴스가 아닌 클래스 자체이다.

        // load를 이용해 이미지와 좌표 json파일을 phaser라이브러리에 로드한다.
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/images/map.json');
        this.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
    }

    create() {
        // 맵을 만든다.
        const map = this.make.tilemap({key: 'map'});
        this.map = map;
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0);
        const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
        const layer2 = map.createStaticLayer('Tile Layer 2', tileset, 0, 0);
        layer1.setCollisionByProperty({collides:true}); // 충돌 설정
        this.matter.world.convertTilemapLayer(layer1);

        this.addResources();

        // 플레이어 캐릭터를 만들고 동작 방향키를 설정
        this.player = new Player( { scene: this, x: 100, y: 100, texture: 'female', frame: 'townsfolk_f_idle_1' } );
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }

    // 주변 사물을 만들고 고정시킨다.
    addResources() {
        // tiled툴에서 map.json을 저장한후 export해줘야한다. (edit > preferences설정에 resolve object type 체크가 되어있어야함)
        const resources = this.map.getObjectLayer('Resources');
        resources.objects.forEach(resource => {
            let resItem = new Phaser.Physics.Matter.Sprite(this.matter.world, resource.x, resource.y, 'resources', resource.type);
            let yOrigin = resource.properties.find(p => p.name == 'yOrigin').value;
            resItem.x += resItem.width/2;
            resItem.y -= resItem.height/2;
            resItem.y = resItem.y + resItem.height * (yOrigin - 0.5);
            const { Body, Bodies } = Phaser.Physics.Matter.Matter;
            var circleCollider = Bodies.circle(resItem.x, resItem.y, 12, { isSensor: false, label: 'collider' });
            resItem.setExistingBody(circleCollider);
            resItem.setStatic(true);
            resItem.setOrigin(0.5, yOrigin);
            this.add.existing(resItem);
         })
    }

    update() {
        this.player.update();
    }
}