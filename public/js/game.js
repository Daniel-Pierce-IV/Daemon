//Temporary reference for game/state settings.
//Helper object to keep all state transitions in one place
var DAEMON = {
    state: {
        BOOT: function(){
            game.state.start('BootState');
        },
        PRELOAD: function(){
            game.state.start('PreloadState');
        },
        MAIN: function(){
            game.state.start('MainState');
        },
        MATCHMAKING: function(){
            game.state.start('MatchmakingState');
        },
        MONSTERS: function(){
            game.state.start('MonsterTeamState');
        },
        BATTLE: function(){
            game.state.start('BattleState');
        },
    },
    settings: {
//        width: window.innerWidth,
//        height: window.innerHeight,
        width: 800,
        height: 450,
//        width: 480,
//        height: 320,
        renderer: Phaser.AUTO,
        parent: '',
        state: null,
        transparent: false,
        antialias: false,
        physicsConfig: null
    },
};

//Instantiate a new Phaser game
var game = new Phaser.Game(DAEMON.settings.width, DAEMON.settings.height, DAEMON.settings.renderer, DAEMON.settings.parent, DAEMON.settings.state, DAEMON.settings.transparent, DAEMON.settings.antialias);

//Add all game states to the games
game.state.add('BootState', BootState);
game.state.add('PreloadState', PreloadState);
game.state.add('MainState', MainState);
game.state.add('MatchmakingState', MatchmakingState);
game.state.add('MonsterTeamState', MonsterTeamState);
game.state.add('BattleState', BattleState);

//Start the "boot" game state
game.state.start('BootState');
