/* 
 * Version 4.2
 * Created by serdnah2
 * @Andres542
 * http://www.cornersopensource.com
 * skype: andres54211
 * If you need the jsearch search in an folder, please change de var automatically for true, default is false
 */
window.onload = function() {
    var that = null;
    var search = function() {
        this.automatically = false; //search into folder files
        this.items = [];
        this.itemsFound = [];
        this.totalPages = 0;
        this.currentPaginator = 0;
        this.busy = false;
    };

    search.prototype.init = function() {
        that = this;
        function getHTTPObject() {
            if (typeof XMLHttpRequest != 'undefined') {
                return new XMLHttpRequest();
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                }
            }
            return false;
        }

        if (this.automatically) {
            var http = getHTTPObject();
            var url = "php/";
            http.open("GET", url, true);
            http.onreadystatechange = function() {
                if (http.readyState === 4) {
                    that.items = JSON.parse(http.responseText);
                    that.show();
                }
            };
            http.send(null);
        } else {
            var imported = document.createElement('script');
            imported.src = 'js/database.js';
            document.head.appendChild(imported);
            this.show();
        }
    };

    search.prototype.show = function() {
        document.getElementById('wrapper').style.display = "block";
        document.getElementById('found').style.display = "block";
        document.getElementById('paginator').style.display = "block";
        setTimeout(function() {
            that.addClass(document.getElementById("wrapper"), "initWeb", that);
            that.listeners();
        }, 500);
    };

    search.prototype.listeners = function() {
        var element = document.getElementById("searchForm");
        if (element.addEventListener) {
            element.addEventListener("submit", submitForm, false);
        } else if (element.attachEvent) {
            element.attachEvent("onsubmit", submitForm, false);
        }

        function submitForm(eventObject) {
            if (eventObject.preventDefault) {
                eventObject.preventDefault();
            } else if (window.event) /* for ie */ {
                window.event.returnValue = false;
            }
            if (!that.busy) {
                that.busy = true;
                that.find();
            }
        }

        var arrowPrevious = document.getElementById("arrowPrevious");
        arrowPrevious.addEventListener("click", function() {
            document.getElementById("section" + that.currentPaginator).style.display = "none";
            that.currentPaginator--;
            document.getElementById("section" + that.currentPaginator).style.display = "inline-block";
            document.getElementById("currentPages").innerHTML = "P&aacute;gina " + that.currentPaginator + " de: " + that.totalPages;
            if (that.currentPaginator === 1) {
                document.getElementById("arrowPrevious").style.display = "none";
            }
            if (that.currentPaginator < that.totalPages) {
                document.getElementById("arrowNext").style.display = "inline-block";
            }
        });

        var arrowNext = document.getElementById("arrowNext");
        arrowNext.addEventListener("click", function() {
            document.getElementById("section" + that.currentPaginator).style.display = "none";
            that.currentPaginator++;
            document.getElementById("section" + that.currentPaginator).style.display = "inline-block";
            document.getElementById("currentPages").innerHTML = "P&aacute;gina " + that.currentPaginator + " de: " + that.totalPages;
            if (that.totalPages == that.currentPaginator) {
                document.getElementById("arrowNext").style.display = "none";
            }
            if (that.currentPaginator > 1) {
                document.getElementById("arrowPrevious").style.display = "inline-block";
            }
        });
    };

    search.prototype.find = function() {
        this.itemsFound = [];
        this.removeClass(document.getElementById("paginator"), "initWeb", this);
        this.removeClass(document.getElementById("found"), "initWeb", this);
        this.addClass(document.getElementById("logo"), "closeLogo", this);

        setTimeout(function() {
            var matchString = document.forms.searchForm.search.value;
            for (var k in that.items) {
                if (that.items[k].title.toLowerCase().match(matchString.toLowerCase()) ||
                        that.items[k].description.toLowerCase().match(matchString.toLowerCase()) ||
                        that.items[k].claves.toLowerCase().match(matchString.toLowerCase())) {
                    that.itemsFound.push(that.items[k]);
                }

                if (k == (that.items.length - 1))
                    that.appendElements(that.itemsFound);
            }
        }, 1000);
    };

    search.prototype.appendElements = function() {
        this.resetPaginator();
        document.getElementById("found").innerHTML = "";
        var totalData = this.itemsFound.length;
        var show = 10;
        var amountToSee = (totalData / show);
        amountToSee = amountToSee.toString();
        amountToSee = amountToSee.split(".");
        if (amountToSee[1]) {
            if (amountToSee[0] == 0) {
                document.getElementById("arrowNext").style.display = "none";
            } else {
                that.addClass(document.getElementById("paginator"), "initWeb", that);
            }
            amountToSee = amountToSee[0];
            amountToSee++;
            this.totalPages = amountToSee;

        } else {
            if (amountToSee[0] == 0) {
                document.getElementById("found").innerHTML = '<div class="alert">No se han encontrado resultados. Por favor inserte una nueva palabra</div>';
                that.addClass(document.getElementById("found"), "initWeb", that);
            } else {
                if (amountToSee[0] == 1) {
                    document.getElementById("arrowNext").style.display = "inline-block";
                }
                this.totalPages = amountToSee;
            }

        }

        var current = 0;
        for (var s = 1; s <= amountToSee; s++) {
            var divFound = document.getElementById("found");
            divFound.innerHTML = divFound.innerHTML + '<div id="section' + s + '" class="itemResult"></div>';
            for (var i = (current * show); i <= ((show * s) - 1); i++) {
                if (that.itemsFound[i]) {
                    var divSection = document.getElementById("section" + s);
                    divSection.innerHTML = divSection.innerHTML + '<div class="itemResultado"><a href=' + that.itemsFound[i].link + '>' + that.itemsFound[i].title + '</a><div class="linkGreen">' + that.itemsFound[i].link + '</div><div>' + that.itemsFound[i].description + '</div><br/></div>';
                    if (i == ((show * s) - 1)) {
                        current++;
                    }
                }

            }
            if (amountToSee == s) {
                document.getElementById("currentPages").innerHTML = "P&aacute;gina " + that.currentPaginator + " de: " + that.totalPages;
                that.addClass(document.getElementById("found"), "initWeb", that);
                that.addClass(document.getElementById("paginator"), "initWeb", that);
            }

        }
    };

    search.prototype.resetPaginator = function() {
        this.totalPages = 0;
        this.currentPaginator = 1;
        document.getElementById("arrowPrevious").style.display = "none";
        document.getElementById("currentPages").innerHTML = "P&aacute;gina " + this.currentPaginator;
        document.getElementById("arrowNext").style.display = "inline-block";
        this.busy = false;
    };

    search.prototype.addItem = function(title, link, description, claves) {
        this.items.push({"title": title, "link": link, "description": description, "claves": claves});
    };

    search.prototype.hasClass = function(ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    search.prototype.addClass = function(ele, cls, that) {
        if (!that.hasClass(ele, cls))
            ele.className += cls;
    };

    search.prototype.removeClass = function(ele, cls, that) {
        if (that.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, '');
        }
    };

    jsearch = new search();
    jsearch.init();
};
