window.onload = function () {
    enchant();

    var game = new Game(483, 585);

    game.fps = 15;
    
    game.preload('images/background.png', 'images/tetriscell_10x10.png', 'images/tetriscell_22x22.png');
    
    game.onload = function() {
    	
        var background = new Sprite(game.width, game.height);
        background.x = background.y = 0;
        background.image = game.assets['images/background.png'];
        game.rootScene.addChild(background);
        
        // display Pad
        game.pad = new Pad();
        game.pad.x = 0;
        game.pad.y = 490;
        game.rootScene.addChild(game.pad);
        //game.rootScene.backgroundColor = 'rgb(255, 255, 255)';
        
        game.addEventListener('enterframe', function(e) {
            // check input (from key or pad) on every frame
            if(game.input.left){
            	if(oTetrisPan.checkBoundary(oTetrisShape, 'x', true)){
            		oTetrisShape.x -= game.nCellSize;
            	}            	
            }else if(game.input.right){
            	if(oTetrisPan.checkBoundary(oTetrisShape, 'x', false)){
            		oTetrisShape.x += game.nCellSize;
            	}            	
            }else if(game.input.up){
            	//TetrisShape0.y -= game.nCellSize;
            	oTetrisShape.rotate();
            }else if(game.input.down){
            	if(oTetrisPan.checkBoundary(oTetrisShape, 'y', false)){
            		oTetrisShape.y += game.nCellSize;
            	}            	
            }

        });
        
        game.nCellSize = 22;
        
        var oTetrisPan = new TetrisPan(game.nCellSize);
        var htStartPosition = oTetrisPan.getStartPosition();
        
        var oTetrisShape = new TetrisShape(Math.floor(Math.random() * 10), game.nCellSize);
        oTetrisShape.x = htStartPosition.x;
        oTetrisShape.y = htStartPosition.y;
        game.rootScene.addChild(oTetrisShape);
        
        
    };
    game.start();
    

    var TetrisPan = enchant.Class.create({
    	initialize: function(nCellSize){
    		this.nMin = {};
    		this.nMax = {};
    		this.nCellSize = nCellSize;
    		this.nMin.x = 133;
    		this.nMax.x = this.nMin.x + (nCellSize * 10);
    		this.nMin.y = 70;
    		this.nMax.y = this.nMin.y + (nCellSize * 20);
    	},
    	checkBoundary: function(oTetrisShape, sPositionType, bMinus){
    		var bResult = true, nCellSize = this.nCellSize;
    		if(bMinus){
    			nCellSize = this.nCellSize * (-1);
    		}
    		console.log(oTetrisShape)
			for(var i=0; i<4; i++){
				var nCellPosition = oTetrisShape[sPositionType] + oTetrisShape.aoCell[i][sPositionType] + nCellSize;
				console.log(this.nMax[sPositionType] + '<='+ (nCellPosition));
				if(	(this.nMin[sPositionType] > nCellPosition)
				|| 	(this.nMax[sPositionType] <= nCellPosition) ){
					bResult = false;
					continue;
				} 
			}
    		return bResult;
    	},
    	getStartPosition: function(){
    		return {x:this.nMin.x + (this.nCellSize * 4) , y: this.nMin.y};
    	}
    })
    
    var TetrisCell = enchant.Class.create(enchant.Sprite, {
    	initialize: function(nColorIndex, nCellSize){
    		enchant.Sprite.call(this, nCellSize, nCellSize);
    		if(nColorIndex < 0 || nColorIndex > 5){
    			nColorIndex = 0;
    		}
    		this.image = game.assets['images/tetriscell_'+nCellSize+'x'+nCellSize+'.png'];
    		this.frame = nColorIndex;
    	}
    });

    var TetrisShape = enchant.Class.create(enchant.Group, {
    	initialize: function(nShapeIndex, nCellSize){
    		enchant.Group.call(this);
    		
    		if(nShapeIndex < 0 || nShapeIndex > 5){
    			nShapeIndex = 0;
    		}
    		// Standard cell for rotation ==> ▩
    		this.nStandardCellIndex = null;
    		
    		this.nCellSize = nCellSize;
    		
    		this.aoCell = new Array();
    		for(var i=0; i<4; i++){
    			this.aoCell.push(new TetrisCell(nShapeIndex, nCellSize));
    		}
    		
    		// ▣▩▣▣
    		if(nShapeIndex == 0){
    			this.aoCell[0].x = nCellSize * (-1),	this.aoCell[0].y = 0;
    			this.aoCell[1].x = 0, 					this.aoCell[1].y = 0;
    			this.aoCell[2].x = nCellSize,	 		this.aoCell[2].y = 0;
    			this.aoCell[3].x = nCellSize * 2, 		this.aoCell[3].y = 0;
    			
    		// ▣▩▣
    		//     ▣
    		}else if(nShapeIndex == 1){
    			this.aoCell[0].x = nCellSize * (-1),	this.aoCell[0].y = 0;
    			this.aoCell[1].x = 0, 					this.aoCell[1].y = 0;
    			this.aoCell[2].x = nCellSize, 			this.aoCell[2].y = 0;
    			this.aoCell[3].x = nCellSize, 			this.aoCell[3].y = nCellSize;
    			
    		// ▣▩▣
    		// ▣
    		}else if(nShapeIndex == 2){
    			this.aoCell[0].x = nCellSize * (-1),	this.aoCell[0].y = 0;
    			this.aoCell[1].x = 0, 					this.aoCell[1].y = 0;
    			this.aoCell[2].x = nCellSize, 			this.aoCell[2].y = 0;
    			this.aoCell[3].x = nCellSize * (-1),	this.aoCell[3].y = nCellSize;
    			
    		// ▣
    		// ▩▣
    		//   ▣
    		}else if(nShapeIndex == 3){
    			this.aoCell[0].x = 0, 					this.aoCell[0].y = nCellSize * (-1);
    			this.aoCell[1].x = 0, 					this.aoCell[1].y = 0;
    			this.aoCell[2].x = nCellSize, 			this.aoCell[2].y = 0;
    			this.aoCell[3].x = nCellSize, 			this.aoCell[3].y = nCellSize;
    			
    		//   ▣
    		// ▩▣
    		// ▣
    		}else if(nShapeIndex == 4){
    			this.aoCell[0].x = nCellSize, 		this.aoCell[0].y = 0;
    			this.aoCell[1].x = 0, 					this.aoCell[1].y = nCellSize;
    			this.aoCell[2].x = nCellSize, 		this.aoCell[2].y = nCellSize;
    			this.aoCell[3].x = 0, 					this.aoCell[3].y = nCellSize * 2;
    			
    		// ▣▩
    		// ▣▣
    		}else if(nShapeIndex == 5){
    			this.aoCell[0].x = 0, 					this.aoCell[0].y = 0;
    			this.aoCell[1].x = nCellSize, 		this.aoCell[1].y = 0;
    			this.aoCell[2].x = 0, 					this.aoCell[2].y = nCellSize;
    			this.aoCell[3].x = nCellSize, 		this.aoCell[3].y = nCellSize;
    		}
    		for(var i=0; i<4; i++){
    			this.addChild(this.aoCell[i]);
    		}
			this.nStandardCellIndex = 1;
    	},
    	rotate : function(){
    		// theory 
    		// (x, y) -> (y, -x)
    		for(var i=0; i<4; i++){
    			var temp = this.aoCell[i].x; 
    			this.aoCell[i].x = this.aoCell[i].y;
    			this.aoCell[i].y = temp * (-1);
    		}
    	}
    });
    
    //window.scrollTo(0,1);
};