import React from 'react';
import MineSweeperGrid from './MineSweeperGrid';
import MineSweeperStore from '../stores/MineSweeperStore';
import PropTypes from 'prop-types';
import MineSweeperActions from '../actions/MineSweeperActions';
import '../../styles/app.sass';
import classnames from 'classnames';

let difficulyLevels = {
    'easy': {
        numRows: 8,
        numCols: 8,
        numOfHiddenMines: 10
    },
    'medium': {
        numRows: 10,
        numCols: 10,
        numOfHiddenMines: 15
    },
    'hard': {
        numRows: 12,
        numCols: 12,
        numOfHiddenMines: 20
    },
};
class MineSweeperGame extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            gridData : MineSweeperStore.getGridData(),
            isGameWon: false,
            isGameLost: false,
            time: 0,
            icon: 'normal',
            level: 'easy',
            numRows: this.props.numRows,
            numCols: this.props.numCols,
            numOfHiddenMines: this.props.numOfHiddenMines,
            isLifeLineActivated: false
        }
    }
    componentDidMount() {
        MineSweeperStore.register(()=>{
            this.iconTimeoutId = null;
            let isGameLost = MineSweeperStore.hasAnyMineRevealed();
            let isGameWon = MineSweeperStore.isGameWon();
            // stop the timer once a game is over
            if(isGameWon || isGameLost){
                clearInterval(this.timeIntervalId);
                clearTimeout(this.iconTimeoutId);
                this.timeIntervalId = null;
            }
            this.setState({
                gridData : MineSweeperStore.getGridData(),
                isGameLost: isGameLost,
                isGameWon: isGameWon,
                numRows: MineSweeperStore.getNumRows(),
                numCols: MineSweeperStore.getNumCols(),
                numOfHiddenMines: MineSweeperStore.getNumOfHiddenMines()
            }, () => {
                if(this.state.isGameWon){
                    this.setState({
                        icon: 'smile'
                    });
                } else if(this.state.isGameLost){
                    this.setState({
                        icon: 'worry'
                    });
                } else if (this.state.icon !== 'normal'){
                    this.iconTimeoutId = setTimeout(()=>{
                        this.setState({
                            icon: MineSweeperStore.hasAnyMineRevealed() ? 'worry' : 'normal'
                        });
                    },100);
                }
            });
        });
        this.createNewGame(this.state.numRows, this.state.numCols, this.state.numOfHiddenMines);
    }

    createNewGame(numRows, numCols, numOfHiddenMines){
        MineSweeperActions.createNewGame({
            numRows: numRows ,
            numCols: numCols,
            numOfHiddenMines: numOfHiddenMines
        });
        clearInterval(this.timeIntervalId);
        this.setState({
            time: 0,
            isLifeLineActivated: false
        });
        this.timeIntervalId = setInterval(this.tick.bind(this), 1000);
    }

    tick(){
        this.setState({
            time : this.state.time + 1
        });
    }

    onCellClick(rowNum, colNum, count, hasHiddenMine, isRevealed ){
        // when ever we click, change the smilie icon to smile icon
        // clear the timeout first. Once the store is updated, we will again update the smilie to normal icon.
        clearTimeout(this.iconTimeoutId);
        this.setState({
            icon: 'smile'
        });
        MineSweeperActions.clickCell({
            rowNum, colNum, count, hasHiddenMine, isRevealed
        });

    }
    levelChange(event){
         let level = event.target.value;
         this.createNewGame(difficulyLevels[level].numRows, difficulyLevels[level].numCols, difficulyLevels[level].numOfHiddenMines);
         this.setState({
            level: event.target.value
         });

    }
    cheat(){
        if(!this.state.isLifeLineActivated){
            MineSweeperActions.showMinesForAMoment(2000);
            this.setState({
                isLifeLineActivated: true
            });
        }
    }
    render(){
        let popOverClassNames1 = classnames({
            'mineSweeperGame-popover': true,
            'hide' : !this.state.isGameLost
        });
        let popOverClassNames2 = classnames({
            'mineSweeperGame-popover': true,
            'hide' : !this.state.isGameWon
        });
        let smilieIconClassNames = classnames({
            'icon': true,
            'normal' : this.state.icon === 'normal',
            'smile': this.state.icon === 'smile',
            'worry': this.state.icon === 'worry'
        });

        let gridClassNames = classnames({
            'mask' : this.state.isGameLost || this.state.isGameWon
        });

        let lifeLineBtnClassNames = classnames({
            'disable': this.state.isLifeLineActivated
        });

        return <div className="mineSweeperGame">
            <div className="score">
                <div className="mines">
                    <div>{this.state.numOfHiddenMines}</div> <div className="bomb" ></div>
                </div>
                <div className="face">
                    <div className={smilieIconClassNames} />
                </div>
                <div className="time">
                    <div className="child">{this.state.time} sec</div>
                </div>
            </div>
            <MineSweeperGrid gridData={this.state.gridData}  numRows={this.state.numRows} numCols={this.state.numCols} onCellClick={this.onCellClick.bind(this)} classNames={gridClassNames} />
            <div className="actions">
                <div className="level">
                    <select value={this.state.level} onChange={this.levelChange.bind(this)}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div className="newGame">
                    <button onClick={this.createNewGame.bind(this, this.state.numRows, this.state.numCols, this.state.numOfHiddenMines)}>New Game</button>
                </div>
            </div>
             <div className="actions">
                <button onClick={this.cheat.bind(this)} disabled={this.state.isLifeLineActivated} className={lifeLineBtnClassNames}>Use Lifeline</button>
             </div>
            <div className={popOverClassNames1} >
                <div className="msg">Oh no! Bomb blasted. Try playing again. </div>
            </div>
            <div className={popOverClassNames2} >
                <div className="msg">Congratulations!!</div>
                <div className="winner" />
                <div className="msg">You are a winner!!</div>
            </div>
        </div>

    }

}

MineSweeperGame.defaultProps = {
    numRows: difficulyLevels['easy'].numRows,
    numCols: difficulyLevels['easy'].numCols,
    numOfHiddenMines: difficulyLevels['easy'].numOfHiddenMines
}

MineSweeperGame.propTypes = {
    numRows: PropTypes.number,
    numCols: PropTypes.number,
    numOfHiddenMines: PropTypes.number
};

export default MineSweeperGame;

