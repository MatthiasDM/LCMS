/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function filterAttributeJson(data, filterBy) {
    var lookup = {};
    var items = data;
    var result = [];


    Object.keys(data).forEach(function (val) {
        var key = data[val][filterBy];
        if (!(key in lookup)) {
            lookup[key] = 1;
            result.push(key);
        }
    })

    return result;
}

function filterUniqueJson(data, filterBy) {
    var lookup = {};
    var items = data;
    var result = [];


    Object.keys(data).forEach(function (val) {
        var key = data[val][filterBy];
        if (!(key in lookup)) {
            lookup[key] = 1;
            result.push(key);
        }
    })

    return result;
}

function filterUnique(data, filterBy) {
    var lookup = {};
    var items = data;
    var result = [];

    for (var item, i = 0; item = items[i++]; ) {

        //$.each((item), function (key, value) {
        var key = item[filterBy];
        if (!(key in lookup)) {
            lookup[key] = 1;
            result.push(key);
        }

    }
    return result;
}