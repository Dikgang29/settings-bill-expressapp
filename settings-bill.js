
module.exports = function SettingsBill() {

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel; 

    

    let actionList = [];

    function setSettings (settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = Number(settings.warningLevel);
        criticalLevel = Number(settings.criticalLevel); 
    }

    function getSettings () {

        if(grandTotal()<=criticalLevel){
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }
    }


    


    
    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function totals() {
        let smsTotal = getTotal('sms').toFixed(2);
        let callTotal = getTotal('call').toFixed(2);
        return {
            smsTotal,
            callTotal,
            grandTotal : grandTotal().toFixed(2)
        }
    }

     
    function hasReachedWarningLevel(){
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel 
            && total < criticalLevel;

        return reachedWarningLevel;
    }

    function hasReachedCriticalLevel(){
        const total = grandTotal();
        return total >= criticalLevel;
    }

    function addClass(){
        
        if(hasReachedWarningLevel()){

            return 'warning';
        }
        else if(hasReachedCriticalLevel()){

            return 'danger'
        }
    }


        


    

    function recordAction(action) {

        let cost = 0;

        
    
        if (action === 'sms'){
            cost = smsCost;
            actionList.push({
                type: action,
                cost,
                currentDate : new Date(),
                timestamp: new Date()
            });
        }
        else if (action === 'call'){
            cost = callCost;
            actionList.push({
                type: action,
                cost,
                currentDate : new Date(),
                timestamp: new Date()
            });
        }
        else if(action != 'sms' && action!= 'call'){
            //returns nothing if sms and call is not checked
            return
        }

      
    }


    function actions(){
        return actionList;
    }

    function actionsFor(type){
        const filteredActions = [];

        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // add the action to the list
                filteredActions.push(action);
            }
        }

        return filteredActions;

        // return actionList.filter((action) => action.type === type);
    }

    function getTotal(type) {
        let total = 0;
        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // if it is add the total to the list
                total += action.cost;
            }
        }
        return total;

      
    }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel,
        addClass
    }
}