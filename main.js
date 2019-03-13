$(function() {
    var paths = _.pluck(window.videos, 'folder');
    // console.log(paths);

    function arrangeIntoTree(paths, cb) {
        var tree = [];

        // This example uses the underscore.js library.
        _.each(paths, function(path) {

            var pathParts = path.split('->');

            var currentLevel = tree; // initialize currentLevel to root

            _.each(pathParts, function(part) {

                // check to see if the path already exists.
                var existingPath = _.findWhere(currentLevel, {
                    name: part
                });

                if (existingPath) {
                    // The path to this item was already in the tree, so don't add it again.
                    // Set the current level to this path's children
                    currentLevel = existingPath.children;
                } else {
                    var newPart = {
                        name: part,
                        children: [],
                    }

                    currentLevel.push(newPart);
                    currentLevel = newPart.children;
                }
            });
        });

        cb(tree);
    }

    arrangeIntoTree(paths, function(tree) {
        console.log('tree: ', tree);

        $(function() {
            $('.folders').tree({
                data: tree,
                autoEscape: false,
                autoOpen: false,
                dragAndDrop: false,
                closedIcon: $('<i class="far fa-arrow-alt-circle-right"></i>'),
                openedIcon: $('<i class="far fa-arrow-alt-circle-down"></i>')
            }).bind('tree.click', function(e) {
                var path, level, i;
                var nodeArray = new Array();
                level = 0;
                path = '';

                // select node and parents
                var node = e.node;

                while (node.parent) {
                  node = node.parent;
                  nodeArray[++level] = node.name;
                }
                nodeArray.reverse();
                for (i=0;i<nodeArray.length;i++) {
                    if (typeof (nodeArray[i]) != "undefined") {
                      path += nodeArray[i] + '->';
                    }
                }
                renderNewVideos(filterFolder(path.substr(2) + e.node.name));
                $('.folderPath').html("Path: " + path.substr(2) + e.node.name);
            });
        });
    });

    _.templateSettings.variable = 'videos';
    var template = _.template(
        $('script.template').html()
    );

    var videos = JSON.parse(JSON.stringify(window.videos));

    var renderVideos = function(arr) {
        $(".videos").html('');
        _.each(arr, function(elem) {
            $('.videos').append(template(elem));
        });
    };

    renderVideos(videos);

    var filtered = function(tag) {

        var tags = _.filter(videos, function(item) {
            return _.contains(item.tags, tag);
        });

        return tags;

    };

    var filterFolder = function(folder) {
        console.log(folder);

        var tags = _.filter(videos, function(item) {
             return item.folder.includes(folder);
        });

        console.log(tags);

        return tags;

    };

    var renderNewVideos = function(arr) {
        $(".videos").html('');
        _.each(arr, function(elem) {
            $('.videos').append(template(elem));
        });
    };

    $(".badge").click(function(){
        renderNewVideos(filtered($(this).html()));
    })

    $("form").submit(function (e) {
        e.preventDefault();
        if ($(".form-control").val()) {
            console.log(filtered($(".form-control").val()));
            if(filtered($(".form-control").val()).length > 0) {
                renderNewVideos(filtered($(".form-control").val()));
            } else {
                $(".videos").html('<p>No videos found</p>');
            }
        } else {
            renderVideos(videos);
        }
    });
});
