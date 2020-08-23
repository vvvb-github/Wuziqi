// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        white: {
            default: null,
            type: cc.SpriteFrame,
        },
        black: {
            default: null,
            type: cc.SpriteFrame,
        },
        light: {
            default: null,
            type: cc.SpriteFrame,
        },
        dark: {
            default: null,
            type: cc.SpriteFrame,
        },
        gamer: {
            default: null,
            visible: false
        },
        color: {
            default: 'none',
            visible: false
        },
        pos: {
            default: new cc.Vec2(0, 0),
            visible: false
        },
        tip: cc.Node
    },

    reset: function() {
        this.tip.active = false;
        this.color = 'none';
        this.getComponent(cc.Sprite).spriteFrame = null;
    },

    setTip: function(state) {
        this.tip.active = state;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gamer = cc.find('Canvas').getComponent('Game');
        this.tip = this.node.getChildByName('tip');
        this.tip.active = false;

        this.node.on('mouseenter', function(event){
            if(!this.gamer.inturn()) return;
            if(this.color != 'none') return;
            if(this.gamer.turn === 0){
                this.getComponent(cc.Sprite).spriteFrame = this.dark
            }else{
                this.getComponent(cc.Sprite).spriteFrame = this.light
            }
        },this);

        this.node.on('mouseleave', function(event){
            if(this.color != 'none') return;
            this.getComponent(cc.Sprite).spriteFrame = null
        },this);

        this.node.on('mouseup', function(event){
            if(!this.gamer.inturn()) return;
            if(this.color != 'none') return;
            this.gamer.makeChess(this.pos.x, this.pos.y);
        },this)
    },

    start () {

    },

    // update (dt) {},
});
