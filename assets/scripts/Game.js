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
        identity: 0,
        point: cc.Prefab,
        board: [],
        gameover: {
            default: null,
            type: cc.Node,
            visible: false
        }
    },

    getPos: function(i, j) {
        return new cc.Vec2(25*i-225, 25*j-225);
    },

    inturn: function() {
        // return this.turn === this.identity;
        return true;
    },

    put: function(point) {
        if(this.turn === 0){
            point.getComponent(cc.Sprite).spriteFrame = point.black;
            point.color = 'black';
        }else{
            point.getComponent(cc.Sprite).spriteFrame = point.white;
            point.color = 'white';
        }
        var fla = this.judgeWin(point.pos);
        if(fla){
            this.gameOver();
        }else{
            this.turn = (this.turn + 1) % 2;
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

    restart: function() {
        for(var i=0;i<19;++i){
            for(var j=0;j<19;++j){
                this.board[i][j].reset();
            }
        }

        this.turn = 0;
        this.gameover.active = false;
    },

    gameOver: function() {
        var info = cc.find('gameover/info', this.node);

        if(this.turn === this.identity){
            info.getComponent(cc.Label).string = '你赢了！';
        }else{
            info.getComponent(cc.Label).string = '你输了！';
        }

        this.turn = 3;
        this.gameover.active = true;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameover = cc.find('gameover', this.node);

        var scene = cc.find('board');

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

    },

    // update (dt) {},
});
