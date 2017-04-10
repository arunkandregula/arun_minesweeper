import AppConstants from '../constants/app-constants';
import * as AppDispatcher from '../dispatchers/app-dispatcher';

export default {
    createNewGame: function(gameData){
        AppDispatcher.dispatch({
            type: AppConstants.CREATE_NEW_GAME,
            data: gameData
        });
    },
    clickCell: function(cellData){
        AppDispatcher.dispatch({
            type: AppConstants.CLICK_CELL,
            data: cellData
        });
    },
    showMinesForAMoment: function(timeDelay){
        AppDispatcher.dispatch({
            type: AppConstants.SHOW_MINES_FOR_A_MOMENT,
            data: timeDelay
        });
    }

}