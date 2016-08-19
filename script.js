var injected = false, onTop = false;
var stateWatch = false, searchBar = true;

$(document).ready(function() {
    var webview = document.getElementById('main-view');

    $('.close').click(function() {
        window.close();
    });

    var watchManipulate = `
        var header = document.getElementById("masthead-positioner");
        header.className += " none";
        var headerOfst = document.getElementById("masthead-positioner-height-offset");
        headerOfst.className += " none";
        var player = document.getElementById("player");
        player.className += " forceTop";
    `;
    var normalManipulate = `
        var header = document.getElementById("masthead-positioner");
        header.className = header.className.replace(" none", "");
        var headerOfst = document.getElementById("masthead-positioner-height-offset");
        headerOfst.className += headerOfst.className.replace(" none", "");
        var player = document.getElementById("player");
        player.className += player.className.replace(" forceTop", "");
    `;
    $('.search').click(function() {
        if(searchBar) {
            webview.executeScript({code: watchManipulate});
        } else {
            webview.executeScript({code: normalManipulate});
        }
        searchBar = !searchBar;
    });
    $('.top').click(function() {
        chrome.app.window.current().setAlwaysOnTop(onTop);
        onTop = !onTop;
    });
    $('.view').click(function() {
        if(stateWatch) {
            chrome.app.window.current().innerBounds.width = 1000;
            chrome.app.window.current().innerBounds.height = 600;
            if(!searchBar) {
                webview.executeScript({code: normalManipulate});
                searchBar = true;
            }
        } else {
            chrome.app.window.current().innerBounds.width = 426;
            chrome.app.window.current().innerBounds.height = 247;
            if(searchBar) {
                webview.executeScript({code: watchManipulate});
                searchBar = false;
            }
        }
        stateWatch = !stateWatch;
    });

    var manipulateCss = `
        body::-webkit-scrollbar {
            display: none;
        }
        .none {
            display: none!important;
        }
        .forceTop {
            top:0!important;
        }
    `;

    webview.addEventListener("loadstop", function(event) {
        if(!injected){
            webview.insertCSS({code: manipulateCss});

            $('html').hover(function(){
                $('.navigation').removeClass('none');
            }, function(){
                $('.navigation').addClass('none');
            });
            injected = true;
        }
    });
});

function updateWebviews() {
    var webview = document.querySelector("webview");
    webview.style.height = document.documentElement.clientHeight + "px";
    webview.style.width = document.documentElement.clientWidth + "px";
};

onload = updateWebviews;
window.onresize = updateWebviews;