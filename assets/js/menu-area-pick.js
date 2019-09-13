// inspired by https://github.com/JanMikes/tomasvotruba.cz/blob/be9da66c3402adfe7928c3798ab1ccd6527f92cd/source/assets/js/checklist.js

$(function() {
    var showRowsInBounds = function(bounds) {
        var tresholdDate = new Date();
        // go 2 hours in the future, so the running meetup is discoverable; e.g. when comming late like me :)
        tresholdDate.setHours(tresholdDate.getHours() - 2);
        var tresholdDateTime = Date.parse(tresholdDate);

        $("tr.meetup").each(function () {
            var meetupLatLng = L.latLng($(this).data('latitude'), $(this).data('longitude'));
            if (bounds.contains(meetupLatLng)) {
                // is in the past?
                var meetupDateTime = Date.parse($(this).data('datetime'));

                if (meetupDateTime < tresholdDateTime) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            } else {
                $(this).hide();
            }
        });

        // see https://stackoverflow.com/a/20064911/1348344
        var visibleMeetups = $("table#table-meetups tr.meetup:visible").length;

        if (visibleMeetups === 0) {
            $("#block-zoomout").show();
        } else {
            $("#block-zoomout").hide();
        }
    };

    // show relevant meetups when map moves
    map.on('moveend', function() {
        showRowsInBounds(map.getBounds());

        // see https://stackoverflow.com/a/30764409/1348344
        var bounds_link = '?bounds=' + boundsToString(map.getBounds());
        history.pushState({}, null, bounds_link);
    });

    var pastBounds = window.localStorage.getItem('bounds');
    if (pastBounds) {
        showRowsInBounds(restoreBoundFromString(pastBounds));
    }
});
