import {EventEmitter} from 'events';
import AppConstants from '../constants/app-constants';
import * as AppDispatcher from '../dispatchers/app-dispatcher';
import classnames from 'classnames';

let _gameData = {
    numRows : 8,
    numCols: 8,
    numOfHiddenMines: 10,
    hiddenMineLocations: []
};

let _gridData = [];

var MineSweeperStore = Object.assign(EventEmitter.prototype, {
    register(callback){
        MineSweeperStore.on(AppConstants.CHANGE_EVENT, callback);
    },
    update(gameState){
        Object.assign(_gameData, {
            numRows : gameState.numRows,
            numCols: gameState.numCols,
            numOfHiddenMines: gameState.numOfHiddenMines
        });
        _gameData.hiddenMineLocations = this.createHiddenMines(_gameData.numRows, _gameData.numCols, _gameData.numOfHiddenMines);
    },
    createHiddenMines(numRows, numCols, numOfHiddenMines){
        let set = [];
        // generate random locations hwere hidden mines can be placed
        // this logic can be obviously optimized. But leaving it simple and stupid for now.
        while(set.length < numOfHiddenMines){
            let randomRow = Math.floor(Math.random()*numRows);
            let randomCol = Math.floor(Math.random()*numCols);
            let duplicateLocation = set.find((eachLocation)=>{
                return eachLocation.rowNum === randomRow && eachLocation.colNum === randomCol;
            });
            // making sure we dont add dubplicate random mine locations
            if(duplicateLocation == null){
                set.push({
                    rowNum: randomRow,
                    colNum: randomCol
                });
            }
        }
        console.log('mines set = ', set);
        return set;
    },
    createNewGame(gameData){
        // Create new Game Data for every new game.
        _gameData = {
            numRows: gameData.numRows,
            numCols: gameData.numCols,
            numOfHiddenMines:gameData.numOfHiddenMines,
            hiddenMineLocations: MineSweeperStore.createHiddenMines(gameData.numRows, gameData.numCols, gameData.numOfHiddenMines),
            hasAnyMineRevealed: false,
            numOfCellsRevealed : 0
        };

        _gridData = this.generateGridData(_gameData);
    },
    generateGridData(gameData){
        let rows = [];
        // Step 1: Create Default Rows And Columns without any mines
        for(let r = 0 ; r < gameData.numRows; r++){
            let cols = [];
            for(let c = 0 ; c < gameData.numCols; c++){
                let cellData = {
                    key: `cell-${r}-${c}`,
                    rowNum: r,
                    colNum: c,
                    count: 0,
                    hasHiddenMine: false,
                    isRevealed: false
                };
                cellData.classNames = this.getClassNames(cellData);
                cols.push(cellData);
            }
            rows.push(cols);
        }
        // Step 2: Place mines
        for(let i = 0; i < gameData.hiddenMineLocations.length; i++){
            let mineLocation = gameData.hiddenMineLocations[i];
            let cell = rows[mineLocation.rowNum][mineLocation.colNum];
            cell.hasHiddenMine = true;
            cell.classNames = this.getClassNames(cell);
            this.incrementCountForSurroundingCells(rows, mineLocation.rowNum, mineLocation.colNum);
        }
        return rows;
    },
    getClassNames(cellData){
        return classnames({
            'active' : cellData.isRevealed,
            'mine': cellData.hasHiddenMine,
            'cell': true
        });
    },
    incrementCountForSurroundingCells(rows, row, col){
        for(let r = row-1; r <= row+1; r++){
            for(let c = col-1; c <= col+1; c++){
                if(this.isValidLocation(rows, r, c) && !(r === row && c === col)){
                    rows[r][c].count++;
                    //console.log('incrementCountForSurroundingCells, for r = ' + r + ', c = ' + c + ', value = ' +  rows[r][c].count );
                }
            }
        }
    },
    isValidLocation(rows, rowNum, colNum){
        return rowNum >= 0 && colNum >= 0 && rowNum < rows.length && colNum < rows[0].length;
    },
    getNumRows(){
        return _gameData.numRows;
    },
    getNumCols(){
        return _gameData.numCols;
    },
    getNumOfHiddenMines(){
        return _gameData.numOfHiddenMines;
    },
    getHiddenMineLocations(){
        return _gameData.hiddenMineLocations;
    },
    getGridData(){
        return _gridData;
    },
    hasAnyMineRevealed(){
        return _gameData.hasAnyMineRevealed;
    },
    /*
        When a user clicks a tile, one of two things happens.:
        Case 1. If the tile hasHidenMine, the mine is revealed and the game ends in failure.
        Case 2: Else if the tile count === 0, behaves as if the user has clicked on every cell around it.
        Case 3. Else if the tile count > 0

        For Case 1, Case 2, Case 3 - we have to regardless reveal the tile. But in case 2, we dont show value.
    */
    clickCell(cellData){
        // if already clicked, ignore
        if(cellData.isRevealed){
            return;
        }
        // First, update the classNames
        let originalCell = _gridData[cellData.rowNum][cellData.colNum];
        originalCell.isRevealed = true;
        _gameData.numOfCellsRevealed++;

        originalCell.classNames = this.getClassNames(originalCell);

        // Case 1: If the tile hasHidenMine, the mine is revealed and the game ends in failure.
        if(originalCell.hasHiddenMine){
            _gameData.hasAnyMineRevealed = true;
        } else if(originalCell.count === 0){
            // Case 3: Else if the tile count === 0, behaves as if the user has clicked on every cell around it.
            this.clickAllSurroundingCells(originalCell);
        }

    },
    isGameWon(){
        let totalNumOfCells = _gameData.numRows * _gameData.numCols;
        let totalNumOfCellsRevealed = _gameData.numOfCellsRevealed;
        let totalNumOfMines = _gameData.numOfHiddenMines;
        //console.log('totalNumOfCells:', totalNumOfCells);
        //console.log('totalNumOfCellsRevealed:', totalNumOfCellsRevealed);
        //console.log('totalNumOfMines:', totalNumOfMines);
        //console.log('diff:', totalNumOfCells - totalNumOfCellsRevealed);
        return totalNumOfMines === totalNumOfCells - totalNumOfCellsRevealed;
    },
    clickAllSurroundingCells(cellData){
        let row = cellData.rowNum;
        let col = cellData.colNum;
        let rows = _gridData;
        for(let r = row-1; r <= row+1; r++){
            for(let c = col-1; c <= col+1; c++){
                if(this.isValidLocation(rows, r, c) && !(r === row && c === col)){
                    if(!_gridData[r][c].isRevealed){
                        this.clickCell(_gridData[r][c]);
                    }
                }
            }
        }
    },
    showAllMines(){
        for(let i = 0; i < _gameData.hiddenMineLocations.length; i++){
            let mineLocation = _gameData.hiddenMineLocations[i];
            let cell = _gridData[mineLocation.rowNum][mineLocation.colNum];
            cell.isRevealed = true;
            cell.classNames = this.getClassNames(cell);
        }
    },
    hideAllMines(){
        for(let i = 0; i < _gameData.hiddenMineLocations.length; i++){
            let mineLocation = _gameData.hiddenMineLocations[i];
            let cell = _gridData[mineLocation.rowNum][mineLocation.colNum];
            cell.isRevealed = false;
            cell.classNames = this.getClassNames(cell);
        }
    },

    dispatchToken : AppDispatcher.register((payload)=>{
        let actionType = payload.action.type;
        switch(actionType){
            case AppConstants.CREATE_NEW_GAME:
                MineSweeperStore.createNewGame(payload.action.data);
                break;
            case AppConstants.CLICK_CELL:
                MineSweeperStore.clickCell(payload.action.data);
                break;
            case AppConstants.SHOW_MINES_FOR_A_MOMENT:
                let timeDelay = payload.action.data;
                MineSweeperStore.showAllMines();
                setInterval(()=>{
                    MineSweeperStore.hideAllMines();
                    MineSweeperStore.emit(AppConstants.CHANGE_EVENT);
                }, timeDelay );
                break;
        }
        MineSweeperStore.emit(AppConstants.CHANGE_EVENT);
    })
});

export default MineSweeperStore;