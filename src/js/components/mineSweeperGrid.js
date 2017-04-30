import React from 'react';
import Cell from './mineSweeperCell';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class MineSweeperGrid extends React.Component {
    /*
        When a user clicks a tile, one of two things happens.:
        Case 1. If the tile hasHidenMine, the mine is revealed and the game ends in failure.
        Case 2. Else if the tile count > 0, reveal the count of the tile.
        Case 3: Else if the tile count === 0, behaves as if the user has clicked on every cell around it.
    */
    onCellClick(rowNum, colNum, count, hasHiddenMine, isRevealed ){
        this.props.onCellClick(rowNum, colNum, count, hasHiddenMine, isRevealed );
    }

    getRows(){
        let gridData = this.props.gridData;
        if(gridData == null || gridData.length === 0) {
            return null;
        }

        let rows = gridData.map((eachRow, rIndex)=>{
            let cols = eachRow.map((eachCell, cIndex)=>{
                let cellStyle = {
                    width: 100/this.props.numRows + '%',
                    height: '100%'
                }
                return <div key={eachCell.key} className="mineSweeperGrid-col" style={cellStyle}>
                    <Cell
                        count={eachCell.count}
                        hasHiddenMine={eachCell.hasHiddenMine}
                        isRevealed={eachCell.isRevealed}
                        rowNum={eachCell.rowNum}
                        colNum={eachCell.colNum}
                        onCellClick={this.onCellClick.bind(this)}
                        classNames={eachCell.classNames}
                    />
                </div>;
            });
            let rowKey = "row-" + rIndex;
            let rowStyle = {
                    height: 100/this.props.numCols + '%'
            }
            return <div className="mineSweeperGrid-row" key={rowKey} style={rowStyle}>{cols}</div>;
        });
        return rows;
    }
    render(){
        let classNames = this.props.classNames + ' mineSweeperGrid';
        return <div className={classNames}>
            {this.getRows()}
        </div>;
    }
}

MineSweeperGrid.defaultProps = {
    gridData: null,
    numCols: 8,
    numRows: 8,
    onCellClick: ()=>{},
    classNames: ''
}

MineSweeperGrid.propTypes = {
    numRows: PropTypes.number,
    numCols: PropTypes.number,
    gridData: PropTypes.array,
    onCellClick: PropTypes.func,
    classNames: PropTypes.string
};

export default MineSweeperGrid;

