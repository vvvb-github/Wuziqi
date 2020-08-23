// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        turn: 0,
        identity: -1,
        point: cc.Prefab,
        board: [],
        gameover: {
            default: null,
            type: cc.Node,
            visible: false
        },
        timer: {
            default: null,
            type: cc.Node,
            visible: false
        },
        count: {
            default: 0,
            visible: false
        },
        toggle: {
            default: false,
            visible: false
        },
        leftTime: {
            default: 0,
            visible: false
        },
        socket: {
            default: null,
            visible: false
        },
        canClick: true,
        audio: cc.AudioClip,
        lastPoint: {
            default: new cc.Vec2(0, 0),
            visible: false
        }
    },

    getPos: function(i, j) {
        return new cc.Vec2(25*i-225, 25*j-225);
    },

    newTurn: function() {
        this.toggle = true;
        this.count = 0;
        this.timer.getComponent(cc.ProgressBar).progress = 1;
        this.leftTime = 60;
        this.timer.getChildByName('count').getComponent(cc.Label).string = 60;
        this.timer.active = true;
    },

    turnOver: function() {
        this.timer.active = false;
        this.toggle = false;
    },

    inturn: function() {
        return this.canClick && this.turn === this.identity;
        // return this.turn < 2;
    },

    makeChess: function(x, y) {
        var data = {
            id: 2,
            x: x,
            y: y
        };
        this.socket.send(data);
    },

    put: function(x, y) {
        var point = this.board[x][y]
        this.turnOver();

        if(this.turn === 0){
            point.getComponent(cc.Sprite).spriteFrame = point.black;
            point.color = 'black';
        }else{
            point.getComponent(cc.Sprite).spriteFrame = point.white;
            point.color = 'white';
        }
        this.board[this.lastPoint.x][this.lastPoint.y].setTip(false);
        this.lastPoint = point.pos;
        point.setTip(true);
        cc.audioEngine.playEffect(this.audio, false);

        var fla = this.judgeWin(point.pos);
        if(fla){
            this.gameOver(this.turn === this.identity);
        }else{
            this.turn = (this.turn + 1) % 2;
            this.newTurn();
        }
    },

    judgeWin: function(pos) {
        var clr = (this.turn === 0? 'black':'white');
        var cnt = [0,0,0,0,0,0,0,0];

        for(var i=pos.x,j=pos.y;i>=0&&this.board[i][j].color===clr;--i) cnt[0]++;
        for(var i=pos.x,j=pos.y;i<19&&this.board[i][j].color===clr;++i) cnt[1]++;
        for(var i=pos.x,j=pos.y;j>=0&&this.board[i][j].color===clr;--j) cnt[2]++;
        for(var i=pos.x,j=pos.y;j<19&&this.board[i][j].color===clr;++j) cnt[3]++;
        for(var i=pos.x,j=pos.y;i>=0&&j>=0&&this.board[i][j].color===clr;--i,--j) cnt[4]++;
        for(var i=pos.x,j=pos.y;i<19&&j<19&&this.board[i][j].color===clr;++i,++j) cnt[5]++;
        for(var i=pos.x,j=pos.y;i>=0&&j<19&&this.board[i][j].color===clr;--i,++j) cnt[6]++;
        for(var i=pos.x,j=pos.y;i<19&&j>=0&&this.board[i][j].color===clr;++i,--j) cnt[7]++;

        for(var i=0;i<8;i+=2){
            if(cnt[i]+cnt[i+1]>5) return true;
        }

        return false;
    },

    btnRestart: function() {
        var data = {
            id: 4
        };
        this.socket.send(data);
        this.gameover.getChildByName('wait').active = true;
        this.gameover.getChildByName('restart').getComponent(cc.Button).interactable = false;
    },

    btnBack: function() {
        this.socket.disconnect();
    },

    restart: function() {
        for(var i=0;i<19;++i){
            for(var j=0;j<19;++j){
                this.board[i][j].reset();
            }
        }

        this.turn = 0;
        this.gameover.active = false;
        this.canClick = true;
        this.newTurn();
    },

    gameOver: function(win) {
        var info = cc.find('gameover/info', this.node);

        if(win){
            info.getComponent(cc.Label).string = '你赢了！';
        }else{
            info.getComponent(cc.Label).string = '你输了！';
        }

        this.gameover.getChildByName('wait').active = false;
        this.gameover.getChildByName('restart').getComponent(cc.Button).interactable = true;
        this.gameover.active = true;
        this.canClick = false;
    },

    btnLose: function() {
        if(!this.canClick){
            return;
        }

        var data = {
            id: 3,
            identity: this.identity
        };
        this.socket.send(data);
    },

    lose: function(identity) {
        this.turnOver();
        this.gameOver(identity != this.identity);
    },

    btnDiscard: function() {
        if(!this.canClick){
            return;
        }

        this.makeChess(-1,-1);
    },

    discard: function() {
        this.turn = (this.turn + 1) % 2;
        this.newTurn();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameover = cc.find('gameover', this.node);
        this.timer = cc.find('timer', this.node);
        this.socket = cc.director.getScene().getChildByName('App').getComponent('WebSocket');

        var scene = cc.find('Canvas/board');

        for(var i=0;i<19;++i){
            this.board.push([])
            for(var j=0;j<19;++j){
                var node = cc.instantiate(this.point);
                node.parent = scene;
                var pos = this.getPos(i, j);
                node.setPosition(pos.x, pos.y);
                var point = node.getComponent('Point');
                point.pos = new cc.Vec2(i, j);
                this.board[i].push(point);
            }
        }
    },

    start () {
        this.newTurn();
    },

    update (dt) {
        if(this.toggle){
            this.timer.getComponent(cc.ProgressBar).progress -= dt/60;

            this.count += dt;
            if(this.count >= 1){
                this.count = 0;
                this.timer.getChildByName('count').getComponent(cc.Label).string = --this.leftTime;
                if(this.leftTime <= 0){
                    this.btnDiscard();
                }
            }
        }
    },
});
