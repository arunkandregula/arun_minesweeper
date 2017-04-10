import React from 'react';
import PropTypes from 'prop-types';


class MineSweeperCell extends React.Component {
    onCellClick(event){
        this.props.onCellClick(this.props.rowNum, this.props.colNum, this.props.count, this.props.hasHiddenMine, this.props.isRevealed );
    }
    render(){
        /*
         return <div className={this.props.classNames} onClick={this.onCellClick.bind(this)}>
                {this.props.count}
            </div>;
        */

        if(this.props.isRevealed && this.props.count !== 0){
            return <div className={this.props.classNames} onClick={this.onCellClick.bind(this)}>
                {this.props.count}
            </div>;
        } else{
            return <div className={this.props.classNames} onClick={this.onCellClick.bind(this)}>
            </div>;
        }

    }
}

MineSweeperCell.defaultProps = {
    classNames: '',
    rowNum: -1,
    colNum: -1,
    count: 0,
    hasHiddenMine: false,
    isRevealed: false,
    onCellClick: ()=>{}
}

MineSweeperCell.propTypes = {
    classNames: PropTypes.string,
    rowNum: PropTypes.number.isRequired,
    colNum: PropTypes.number.isRequired,
    count: PropTypes.number,
    hasHiddenMine: PropTypes.bool,
    isRevealed: PropTypes.bool,
    onCellClick: PropTypes.func
};

export default MineSweeperCell;
