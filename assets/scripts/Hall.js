// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import axios from '_axios@0.20.0@axios';
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
        rid: '0000',
        canClick: true
    },

    newRoom: function() {
        if(!this.canClick) {
            return;
        }

        axios.get(config.httpUrl+':'+config.port+config.path+'/newroom')
            .then(res=>{
                this.rid = res.data;

                this.socket.connect('/websocket/'+this.rid);

                this.room.getChildByName('id').getComponent(cc.Label).string = '房间号：'+this.rid;
                this.room.active = true;
                this.canClick = false;
            }).catch(err=>{
                console.log(err);
            })
    },

    cancelRoom: function() {
        this.socket.disconnect();
        this.room.active = false;
        this.canClick = true;
    },

    joinRoom: function() {
        if(!this.canClick) {
            return;
        }
        this.search.active = true;
        this.canClick = false;
    },

    confirm: function() {
        this.rid = this.search.getChildByName('rid').getComponent(cc.EditBox).string;

        axios.get(config.httpUrl+':'+config.port+config.path+'/joinroom',{
            params: {rid: this.rid}
        }).then(res=>{
            if(res.data){
                this.search.getChildByName('info').getComponent(cc.Label).string = '等待其他玩家响应...';

                this.socket.connect('/websocket/'+this.rid);

                this.cb = () => {
                    if(this.socket.inConnect()){
                        var data = {
                            id: 1
                        }
                        this.socket.send(data);
                        this.unschedule(this.cb);
                    }
                }
                this.schedule(this.cb, 1);
            } else {
                this.search.getChildByName('info').getComponent(cc.Label).string = '房间号不存在！';
            }
        }).catch(err=>{
            console.log(err);
        })
    },

    cancel: function() {
        this.search.active = false;
        this.canClick = true;
        if(this.socket && this.socket.inConnect()) {
            this.socket.disconnect();
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.socket = cc.find('App').getComponent('WebSocket');
        this.room = cc.find('Canvas/room');
        this.search = cc.find('Canvas/search');

        cc.director.preloadScene("game", function () {
            cc.log('game preloaded');
        });
    },

    start () {

    },

    // update (dt) {},
});
