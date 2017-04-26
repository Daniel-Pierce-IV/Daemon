var PreloadState = {
    init: function(){
    },
    preload: function(){
        var text = game.add.text(window.innerWidth/2,window.innerHeight/2, "Loading...", {font: "150px Permanent Marker", fill: "#ccc"});
        text.anchor.setTo(0.5);
        
        //Preload all assets that will be used by the game
        game.load.image('main-background', 'img/main-background.jpg');
//        game.load.image('button-default', 'img/button-default.png');
        game.load.image('button-hover', 'img/button-hover.png');
        game.load.image('monster-team-background', 'img/monster-team-background.jpg');
        game.load.image('button-hover', 'img/UIpack/PNG/yellow_button00.png');
        game.load.image('button-press', 'img/UIpack/PNG/yellow_button01.png');
        game.load.image('button-default', 'img/UIpack/PNG/blue_button00.png');
        game.load.spritesheet('button-with-highlight', 'img/UIpack/Spritesheet/blue-button-yellow-highlight.png', 190, 49);
        game.load.image('white-panel', 'img/UIpack/PNG/grey_panel.png');
        game.load.image('white-panel-large', 'img/UIpack/PNG/grey_panel_large.png');
        game.load.image('blue-panel', 'img/UIpack/PNG/blue_panel.png');
        game.load.image('green-panel', 'img/UIpack/PNG/green_panel.png');
        game.load.image('chevron-yellow', 'img/custom-ui/chevron-yellow.png');
        
        //Monster-specific UI
        game.load.image('health-bar-white', 'img/custom-ui/white-rectangle.png');
        game.load.image('health-bar-green', 'img/custom-ui/green-rectangle.png');
        game.load.image('health-bar-yellow', 'img/custom-ui/yellow-rectangle.png');
        game.load.image('health-bar-red', 'img/custom-ui/red-rectangle.png');
        
        //Monster Portraits
        game.load.image('dragon-portrait', 'img/monsters/dragon-portrait.png');
        game.load.image('treant-portrait', 'img/monsters/treant-portrait.png');
        game.load.image('leviathan-portrait', 'img/monsters/leviathan-portrait.png');
        game.load.image('phoenix-portrait', 'img/monsters/phoenix-portrait.png');
        game.load.image('quetzalcoatl-portrait', 'img/monsters/quetzalcoatl-portrait.png');
        game.load.image('wraith-portrait', 'img/monsters/wraith-portrait.png');
        
        //Monster Spritesheets
        game.load.spritesheet('dragon-spritesheet', 'img/monsters/dragon-spritesheet.png', 100, 100);
        game.load.spritesheet('treant-spritesheet', 'img/monsters/treant-spritesheet.png', 100, 100);
        game.load.spritesheet('leviathan-spritesheet', 'img/monsters/leviathan-spritesheet.png', 100, 100);
        game.load.spritesheet('phoenix-spritesheet', 'img/monsters/phoenix-spritesheet.png', 100, 100);
        game.load.spritesheet('quetzalcoatl-spritesheet', 'img/monsters/quetzalcoatl-spritesheet.png', 100, 100);
        game.load.spritesheet('wraith-spritesheet', 'img/monsters/wraith-spritesheet.png', 100, 100);
        game.load.spritesheet('unknown-monster', 'img/monsters/question-mark.png', 100, 100);
    },
    create: function(){
        
    },
    update: function(){
        DAEMON.state.MAIN();
    },
};