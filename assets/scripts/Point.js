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
            type: cc.Node,
            visible: false
        },
        color: {
            default: 'none',
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gamer = cc.find('Canvas');

        this.node.on('mouseenter', function(event){
            if(!this.gamer.getComponent('Game').inturn) return;
            if(this.color != 'none') return;
            if(this.gamer.getComponent('Game').turn === 0){
                this.getComponent(cc.Sprite).spriteFrame = this.dark
            }else{
                this.getComponent(cc.Sprite).spriteFrame = this.light
            }
        }, this);

        this.node.on('mouseleave', function(event){
            if(this.color != 'none') return;
            this.getComponent(cc.Sprite).spriteFrame = null
        },this);

        this.node.on('mousedown', function(event){
            if(!this.gamer.getComponent('Game').inturn) return;
            if(this.gamer.getComponent('Game').turn === 0){
                this.getComponent(cc.Sprite).spriteFrame = this.black
                this.color = 'black'
            }else{
                this.getComponent(cc.Sprite).spriteFrame = this.white
                this.color = 'white'
            }
        },this)
    },

    start () {

    },

    // update (dt) {},
});
