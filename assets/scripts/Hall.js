// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import axios from 'axios';
var config = require('config');

cc.Class({
    extends: cc.Component,

    properties: {
        socket: {
            default: null,
            visible: false
        },
        room: {
            default: null,
            visible: false
        },
        search: {
            default: null,
            visible: false
        },
        rid: '0000'
    },

    newRoom: function() {
        axios.get(config.httpUrl+':'+config.port+config.path+'/newroom')
            .then(res=>{
                this.rid = res.data;

                this.socket.connect('/websocket/'+this.rid);

                console.log(this.room);
                this.room.getChildByName('id').getComponent(cc.Label).string = '房间号：'+this.rid;
                this.room.active = true;
            }).catch(err=>{
                console.log(err);
            })
    },

    cancelRoom: function() {
        this.socket.disconnect();
    },

    joinRoom: function() {},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.socket = this.getComponent('WebSocket');
        this.room = cc.find('Canvas/room');
        this.search = cc.find('Canvas/search');
    },

    start () {

    },

    // update (dt) {},
});
