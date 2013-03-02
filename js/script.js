/*
 * 
 * Created by serdnah2
 * @Andres542
 * http://www.cornersopensource.com
 * skype: andres54211
 */
var automatically = false; //search into folder files
var items = [];
var itemsFound = [];

window.onload = function() {
    if (!automatically) {
        var imported = document.createElement('script');
        imported.src = 'js/database.js';
        document.head.appendChild(imported);
    } else {
        var url = "php/";
        $.getJSON(url, function(data) {
            items = data;
        });
    }
    $("#arrowPrevious").click(function() {
        $("#section" + currentPaginator).hide();
        currentPaginator--;
        $("#section" + currentPaginator).show();
        $("#paginator span").html("P&aacute;gina " + currentPaginator + " de: " + totalPages);
        if (currentPaginator === 1) {
            $("#arrowPrevious").hide();
        }
        if (currentPaginator < totalPages) {
            $("#arrowNext").show();
        }
    });

    $("#arrowNext").click(function() {
        $("#section" + currentPaginator).hide();
        currentPaginator++;
        $("#section" + currentPaginator).show();
        $("#paginator span").html("P&aacute;gina " + currentPaginator + " de: " + totalPages);
        if (totalPages == currentPaginator) {
            $("#arrowNext").hide();
        }
        if (currentPaginator > 1) {
            $("#arrowPrevious").show();
        }
    });

    $("#wrapper, #found, #paginator").css("display", "block");
    setTimeout(function() {
        $("#wrapper").addClass("initWeb");
    }, 500);
};

function search() {
    itemsFound = [];
    removeClass(document.getElementById("paginator"), "initWeb");
    removeClass(document.getElementById("found"), "initWeb");
    addClass(document.getElementById("logo"), "closeLogo");
    setTimeout(function() {
        var matchString = document.forms.searchForm.search.value;
        for (var k in items) {
            if (items[k].title.toLowerCase().match(matchString.toLowerCase()) ||
                    items[k].description.toLowerCase().match(matchString.toLowerCase())) {
                itemsFound.push(items[k]);
            }

            if (k == (items.length - 1))
                appendElements(itemsFound);
        }
    }, 1000);
}

function appendElements(itemsFound) {
    document.getElementById("found").innerHTML = "";
    resetPaginator();
    var totalData = itemsFound.length;
    var show = 10;
    var amountToSee = (totalData / show);
    amountToSee = amountToSee.toString();
    amountToSee = amountToSee.split(".");
    console.log(amountToSee);
    if (amountToSee[1]) {
        if (amountToSee[0] == 0) {
            $("#arrowNext").hide();
        } else {
            addClass(document.getElementById("paginator"), "initWeb");
        }
        amountToSee = amountToSee[0];
        amountToSee++;
        totalPages = amountToSee;

    } else {
        if (amountToSee[0] == 0) {
            $.error = $('\
                <div class="alert">\
                    No se han encontrado resultados. Por favor inserte una nueva palabra\
                </div>\
            ');
            $("#found").append($.error);
            addClass(document.getElementById("found"), "initWeb");
        } else {
            if (amountToSee[0] == 1) {
                $("#arrowNext").hide();
            }
            totalPages = amountToSee;
        }

    }

    var current = 0;
    for (var s = 1; s <= amountToSee; s++) {
        $.createDiv = $('<div id="section' + s + '" class="itemResult"></div>');
        $("#found").append($.createDiv);
        for (var i = (current * show); i <= ((show * s) - 1); i++) {
            if (itemsFound[i]) {
                $.result = $('\
                    <div class="itemResultado">\
                            <a href=' + itemsFound[i].link + '>' + itemsFound[i].title + '</a>\
                            <div class="linkGreen">' + itemsFound[i].link + '</div>\
                            <div>' + itemsFound[i].description + '</div><br/>\
                    </div>\
                ');
                $("#section" + s).append($.result);
                if (i == ((show * s) - 1)) {
                    current++;
                }
            }

        }
        if (amountToSee == s) {
            $("#paginator span").html("P&aacute;gina " + currentPaginator + " de: " + totalPages);
            addClass(document.getElementById("found"), "initWeb");
            addClass(document.getElementById("paginator"), "initWeb");
            $(".itemResultado").hover(
                    function() {
                        $(this).css("background", "#faf7f7");
                    },
                    function() {
                        $(this).css("background", "transparent");
                    }
            );
        }

    }

}

function resetPaginator() {
    totalPages = 0;
    currentPaginator = 1;
    $("#arrowPrevious").hide();
    $("#paginator span").html("P&aacute;gina " + currentPaginator);
    $("#arrowNext").show();
}

function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
    if (!this.hasClass(ele, cls))
        ele.className += cls;
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, '');
    }
}

function addItem(title, link, description) {
    items.push({"title": title, "link": link, "description": description});
}

