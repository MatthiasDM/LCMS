
function users_doLoad(_parent) {
    console.log("Users load");
    LCMSTableRequest("loadusers", "editusers", "./servlet", "user-table", "user-pager", "div-grid-user-wrapper", lang["users"]['title'], 1,{hiddengrid: true});

}

function mongoconfigurations_doLoad(_parent) {
    console.log("Mongoconfigurations load");
    LCMSTableRequest("MONGOCONFIGURATIONS_LOADMONGOCONFIGURATIONS", "MONGOCONFIGURATIONS_EDITMONGOCONFIGURATIONS", "./admin", "mongoconfigurations-table", "mongoconfigurations-pager", "div-grid-user-wrapper", lang["mongoconfigurations"]['title'],1, {hiddengrid: true});

}

function actions_doLoad(_parent) {
    console.log("Actions load");
        var extraOptions = {
                grouping: true,
                groupingView: {
                    groupField: ['mongoconfiguration'],
                    groupColumnShow: [false],
                    groupText: ['<b>{0} - {1} Item(s)</b>'],
                    groupCollapse: true
                },
                hiddengrid: true
    };
    LCMSTableRequest("ACTIONS_LOADACTIONS", "ACTIONS_EDITACTIONS", "./admin", "actions-table", "actions-pager", "div-grid-actions-wrapper", lang["actions"]['title'],2,extraOptions);
}

function pages_doLoad(_parent) {
    console.log("Pages load");
    LCMSTableRequest("loadpages", "editpages", "./servlet", "pages-table", "pages-pager", "div-grid-pages-wrapper", lang["pages"]['title'], 1,{hiddengrid: true});
}
