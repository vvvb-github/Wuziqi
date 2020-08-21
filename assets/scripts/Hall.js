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
        if(this.search.active) {
            cancel();
        }

        axios.get(config.httpUrl+':'+config.port+config.path+'/newroom')
            .then(res=>{
                this.rid = res.data;

                this.socket.connect('/websocket/'+this.rid);

                this.room.getChildByName('id').getComponent(cc.Label).string = '房间号：'+this.rid;
                this.room.active = true;
            }).catch(err=>{
                console.log(err);
            })
    },

    cancelRoom: function() {
        this.socket.disconnect();
        this.room.active = false;
    },

    joinRoom: function() {
        if(this.room.active) {
            cancelRoom();
        }
        this.search.active = true;
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
        if(this.socket.inConnect()) {
            this.socket.disconnect();
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.socket = cc.find('App').getComponent('WebSocket');
        this.room = cc.find('Canvas/room');
        this.search = cc.find('Canvas/search');
    },

    start () {

    },

    // update (dt) {},
});
