// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var config = require('config');

cc.Class({
    extends: cc.Component,

    properties: {
        ws: {
            default: null,
            visible: false
        },
        audio: cc.AudioClip
    },

    connect: function(fix) {
        this.ws = new WebSocket(config.url+':'+config.port+config.path+fix);

        this.ws.onopen = this.open;
        this.ws.onmessage = this.message;
        this.ws.onclose = this.close;
        this.ws.onerror = this.error;
    },

    disconnect: function() {
        this.ws.close();
    },

    inConnect: function() {
        return this.ws.readyState === 1;
    },

    send: function(data) {
        this.ws.send(JSON.stringify(data));
    },

    open: function() {
        console.log('Connect Success!');
    },

    message: function(res) {
        var data = JSON.parse(res.data);
        var socket = cc.find('App').getComponent('WebSocket');
        console.log(data);

        switch(data.id) {
            case 0:
                socket.disconnect();
                break;
            case 1:
                cc.director.loadScene("game");
                socket.cb = () => {
                    var game = cc.find("Canvas").getComponent('Game')
                    if(game){
                        game.identity = data.identity;
                        socket.unschedule(socket.cb);
                    }
                }
                socket.schedule(socket.cb, 1);
                break;
            case 2:
                if(data.x < 0){
                    cc.find('Canvas').getComponent('Game').discard();
                }else{
                    cc.find('Canvas').getComponent('Game').put(data.x, data.y);
                }
                break;
            case 3:
                cc.find('Canvas').getComponent('Game').lose(data.identity);
                break;
            case 4:
                cc.find('Canvas').getComponent('Game').restart();
                break;
        }
    },

    close: function() {
        cc.director.loadScene("hall");
        var socket = cc.find('App').getComponent('WebSocket');

        socket.cb = () => {
            var backinfo = cc.find('Canvas/backinfo').getComponent('TempNode');
            if(backinfo){
                backinfo.setActive(3);
                socket.unschedule(socket.cb);
            }
        }
        socket.schedule(socket.cb, 1);
    },

    error: function() {},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
    },

    start () {
        cc.audioEngine.playMusic(this.audio, true);
    },

    // update (dt) {},
});
