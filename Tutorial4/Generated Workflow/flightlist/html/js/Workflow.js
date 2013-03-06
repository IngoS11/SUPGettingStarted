/*
 * Sybase Mobile Workflow version 2.1.3
 * 
 * Workflow.js
 * This file will be regenerated, so changes made herein will be removed the
 * next time the workflow is regenerated. It is therefore strongly recommended
 * that the user not make changes in this file.
 * 
 * The template used to create this file was compiled on Fri May 18 13:00:28 PDT 2012
 *
 * Copyright (c) 2010, 2011 Sybase Inc. All rights reserved.
 */



function menuItemCallbackStartCancel() {
    if (!customBeforeMenuItemClick('Start', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('Start', 'Cancel');
}


function menuItemCallbackStartList_Flights() {
    if (!customBeforeMenuItemClick('Start', 'List_Flights')) {
        return;
    }
    var rmiKeys = [];
    var rmiKeyTypes = [];
    var rmiInputOnlyKeys = [];
    var rmiInputOnlyKeyTypes = [];
    var workflowMessageToSend = getMessageValueCollectionForOnlineRequest('Start', 'List_Flights', rmiKeys, rmiKeyTypes);
    var inputOnlyWorkflowMessageToSend = getMessageValueCollectionForOnlineRequest('Start', 'List_Flights', rmiInputOnlyKeys, rmiInputOnlyKeyTypes);
    if (validateScreen('Start', getCurrentMessageValueCollection(), rmiKeys) && 
        saveScreens(true)) {
        doOnlineRequest('Start', 'List_Flights', 60, 0, '', null, workflowMessageToSend, inputOnlyWorkflowMessageToSend.serializeToString());
    }
    customAfterMenuItemClick('Start', 'List_Flights');
}


function menuItemCallbackFlightListDetailBack() {
    if (!customBeforeMenuItemClick('FlightListDetail', 'Back')) {
        return;
    }
    doSaveAction();
    customAfterMenuItemClick('FlightListDetail', 'Back');
}
function menuItemCallbackFlightListDetailCancel() {
    if (!customBeforeMenuItemClick('FlightListDetail', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('FlightListDetail', 'Cancel');
}


function menuItemCallbackFlightListSubmit() {
    if (!customBeforeMenuItemClick('FlightList', 'Submit')) {
        return;
    }

    if (saveScreens()) {
        doSubmitWorkflow('FlightList', 'Submit', '', '');
    }
    customAfterMenuItemClick('FlightList', 'Submit');
}


function menuItemCallbackFlightListCancel() {
    if (!customBeforeMenuItemClick('FlightList', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('FlightList', 'Cancel');
}
function menuItemCallbackErrorListCancel() {
    if (!customBeforeMenuItemClick('ErrorList', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('ErrorList', 'Cancel');
}
function menuItemCallbackErrorDetailCancel() {
    if (!customBeforeMenuItemClick('ErrorDetail', 'Cancel')) {
        return;
    }
    doCancelAction();
    customAfterMenuItemClick('ErrorDetail', 'Cancel');
}

function doAddRowAction() {
    var mvc = getCurrentMessageValueCollection();
    var listview = getListviewMessageValue();
    if (listview) {
        var childMVC = new MessageValueCollection();
        var key = guid();
        childMVC.setKey(key);
        childMVC.setState("new");
        childMVC.setParent(listview.getKey());
        childMVC.setParentValue(listview);
        listview.getValue().push(childMVC);
        console.log(workflowMessage.serializeToString());
        if (validateScreen(getCurrentScreen(), mvc)) {
            listViewValuesKey.pop();
            listViewValuesKey.push(childMVC.getKey());
            doListviewAddRowAction();
            console.log(workflowMessage.serializeToString());
        }
    }
}

function doCreateKeyCollectionAction(addScreen) {
    var mvc = getCurrentMessageValueCollection();
    var relationKey = getListViewKey(getCurrentScreen());
    var mv = mvc.getData(relationKey);
    var childMVC = new MessageValueCollection();
    var key = guid();
    childMVC.setKey(key);
    childMVC.setState("new");
    childMVC.setParent(mv.getKey());
    childMVC.setParentValue(mv);
    mv.getValue().push(childMVC);
    setDefaultValues(addScreen);
    // collect default values from the addScreen
    updateMessageValueCollectionFromUI(childMVC, addScreen);
    navigateForward(addScreen, key);
}

function doListviewAddRowAction(listKey) {
    var mvc = getCurrentMessageValueCollection(listKey);
    if (mvc.getState() === "new") {
        // this action is triggered after AddRow action
        if (validateScreen(getCurrentScreen(), mvc)) {
            mvc.setState("add");
            doSaveAction(false);
        }
    }
}

function doListviewUpdateRowAction(listKey) {
    var mvc = getCurrentMessageValueCollection(listKey);
    if (validateScreen(getCurrentScreen(), mvc)) {
        if (mvc.getState() !== "add") {
            mvc.setState("update");            
        }
        doSaveAction(false);
    }
}

function doListviewDeleteRowAction(listKey) {
    var mvc = getCurrentMessageValueCollection(listKey);
    if (validateScreen(getCurrentScreen(), mvc)) {
        if (mvc.getState() !== "add") {
            mvc.setState("delete");            
            doSaveAction(false);
        }
        else {
            var valuesArray = mvc.getParentValue().getValue();
            for (var i = 0; i < valuesArray.length; i++) {
                if (valuesArray[i] == mvc) {
                    valuesArray.splice(i, 1);
                }
            }
            navigateBack(true);
            updateUIFromMessageValueCollection(getCurrentScreen(), getCurrentMessageValueCollection());
        }        
    }
}

function doSaveActionWithoutReturn() {
   doSaveAction();
   return;
}

function doSaveAction(needValidation) {
    if (!getPreviousScreen()) {
        if(saveScreen(getCurrentMessageValueCollection(), getCurrentScreen(), needValidation)) {
            doSubmitWorkflow(getCurrentScreen(), "Save", '', '');
            return false;
        }
        return true;
    }
    if(saveScreen(getCurrentMessageValueCollection(), getCurrentScreen(), needValidation)) {
        navigateBack(false, false);
        updateUIFromMessageValueCollection(getCurrentScreen(), getCurrentMessageValueCollection());
        return true;
    }
    return false;
}

function doCancelAction() {
    if (!getPreviousScreen()) {
        closeWorkflow();
        return;
    }
    
    var mvc = getCurrentMessageValueCollection();
    navigateBack(true);
    var mvc1 = getCurrentMessageValueCollection();
    
    //if we are moving onto a listview screen we should delete any newly added rows
    if (mvc != mvc1) {
        //find the items of the listview and if any of them are marked as new, delete them.
        var messValues = mvc1.getValues();
        for (var i = 0; i < messValues.length; i++) {
            if (messValues[i].getType() === "LIST") {
                var listViewValuesArray = messValues[i].getValue()
                for (var j = 0; j < listViewValuesArray.length; j++) {
                    if (listViewValuesArray[j].getState() === "new") {
                        listViewValuesArray.splice(j, 1);
                        j--;
                    }
                }
            }        
        }
        updateUIFromMessageValueCollection(getCurrentScreen(), getCurrentMessageValueCollection());
    }
    else if (mvc.getState() === "update") {
        mvc.setState("");
    }
}

function customNavigationEntry() {
    this.condition;
    this.screen;
}
function customNavigationEntry( a_condition, a_screen ) {
    this.condition = a_condition;
    this.screen = a_screen;
}

/**
 * For the specific pair - screen named 'currentScreenKey' and the action 'actionName', return
 * the list of custom navigation condition-names and their destination screens.
 */
function getCustomNavigations( currentScreenKey, actionName )  {
    var customNavigations = new Array();
    return customNavigations;
}
