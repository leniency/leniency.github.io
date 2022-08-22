---
title: Preserving Grid State in KendoUI
date: 2014-05-30
tags: ["Kendo","Javascript"]
layout: "../../layouts/BlogPost.astro"
---

# Preserving Grid State in KendoUI

Continuing from the last post about preserving tab state, next up is automatic, universal grid state preservation. The state could be stored to the session, but then code has to be added server side for each Ajax endpoint. That's not possible of the grid is polling a third party service as well. It's better to handle it all client side with local storage.

```javascript
// Grid extension.
// Adds default grid state perservation via localStorage.
// The grid container can specify a storage location by
// setting the data-store attribute to either:
//  - local     [default]
//  - session
//  - false     Disables storage for this grid.
// 
(function ($, kendo) {

    var
        _init = kendo.ui.Grid.fn.init;

    var handleStorage = function (element, options) {
        var store = $(element).data('store');
        if (store !== false) {

            // Check if the grid has an overriding storage location.
            // Default is local, but can override to session.
            var storage = $.localStorage;
            if (typeof store === 'string' &&
                (store === 'local' || store === 'session')) {
                storage = $[store + "Storage"];
            }

            var dataBound = options.dataBound;
            var key = window.location.pathname + "/#" + element.id;

            // Override the default grid.dataBound event.
            options.dataBound = function (e) {
                var dataSource = e.sender.dataSource;

                // Grab the grid state.
                var state = {
                    page: dataSource.page(),
                    pageSize: dataSource.pageSize(),
                    sort: dataSource.sort(),
                    group: dataSource.group(),
                    filter: dataSource.filter()
                };

                // Store to local.
                storage.set(key, state);

                // Call original databound, if any.
                if (dataBound != null) {
                    dataBound(e);
                }
            };

            //
            // Set initial dataSource options, if any state exists.
            var state = storage.get(key);

            // Set initial state if an stored instance exists.
            if (state) {
                $.extend(options.dataSource, state);
            }
        }
    };

    var Grid = kendo.ui.Grid.extend({
        init: function (element, options) {

            // Handle storage options.
            handleStorage.call(this, element, options);

            // Call the base constructor.
            var r = _init.call(this, element, options);

            return r;
        }
    });

    kendo.ui.plugin(Grid);
}(window.kendo.jQuery, window.kendo));
```

The script will wrap around the grid constructor and setup events to capture the state. It also checks if you wish to use local or session storage in the browser. Local storage persists across browser closes while session won't. Both are useful for different situations.

Currently, only a limited state is captured:
 - Page
 - Page size
 - Sorts
 - Filters
 - Grouping
 - Other options like visible columns are not stored.

The jquery extension for local storage is just a slightly modified version of [Marcus Westin's store.js](https://github.com/marcuswestin/store.js). Modified to attach to jquery and allow selection between local and session storage.