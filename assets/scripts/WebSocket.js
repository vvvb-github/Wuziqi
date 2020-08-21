// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var config = require('config');
const { disconnect } = require('process');

cc.Class({
    extends: cc.Component,

    properties: {
        ws: {
            default: null,
            visible: false
        }
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
                console.log('Join Success!!!');
                break;
        }
    },

    close: function() {
        cc.director.loadScene("hall");
    },

    error: function() {},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
    },

    start () {

    },

    // update (dt) {},
});
