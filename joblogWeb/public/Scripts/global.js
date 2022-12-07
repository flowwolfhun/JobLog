var historyState = {};
var prevPage = '';
var prevScroll = 0;
var prevPage2 = '';
var prevScroll2 = 0;
var setMetaDescription = false;
var googlePostProcessFunction = null;

var classNames = [];

$(document).ready(function () {
    $(document).on('click', 'a', AnchorClick);
    setInterval(() => {
        let rp = window.location.href.replace(new RegExp(pageurl, 'gi'), '');
        if (pageurl.indexOf(rp) > -1) {
            rp = '';
        }
        if (rp !== prevPage) {
            HashChange();
        }

        if ($('.createdDialog.show').length > 0) {
            $('body').addClass('modal-open');
        }

    }, 10);
    window.onresize = ResizeWindow;
});

function ResizeWindow(event ) {
    var ev = new CustomEvent('resizewindow', { detail: { width: window.innerWidth, height: window.innerHeight} });
    document.dispatchEvent(ev);
}

function GetClassName(className) {
    let classList = classNames.filter(fc => fc.key === className.toLocaleLowerCase());
    return classList.length>0?classList[0].value:'';
}

function AddClassName(className) {
    classNames.push({ key: className.toLocaleLowerCase(), value: className });
}

function AnchorClick(evt, navigateTo) {
    if ($("#navbarSupportedContent").hasClass('show')) {
        $(".navbar-toggler").click();
    }
    var dataLinkto = $(this).attr('data-linkto');
    var linkto = $(this).attr('href');
    if (dataLinkto) {
        linkto = dataLinkto;
    }
    else {
        if (linkto) {
            linkto = linkto.replace(pageurl.replace(window.location.origin, ''), '');
        }
        if (linkto && linkto.startsWith('./')) {
            linkto = linkto.substring(2);
        }
    }
    var nonavigate = $(this).attr('data-nonavigate') === 'true';
    var directnav = $(this).attr('data-directnavigate') === 'true';
    if (linkto !== '#' && !nonavigate && !directnav) {
        if (evt) {
            evt.preventDefault();
        }
        //Remove hash from URL and replace with desired URL
        if (history && history.pushState) {
            //Only do this if history.pushState is supported by the browser
            history.pushState(historyState, evt ? evt.target.innerHTML : 'null', pageurl + (navigateTo === '' ? '' : navigateTo || linkto));
        }
        HashChange();
    }
}

function HashChange() {
    $("#googleLoginConatainer").hide().appendTo("#googleLoginConatainerContainer");
    $('.page-content').empty();
    $('body').removeClass('layoutBG');
    setMetaDescription = false;
    let requestedPage = window.location.href.replace(new RegExp(pageurl, 'gi'), '');
    if (pageurl.indexOf(requestedPage) > -1) {
        requestedPage = '';
    }
    if (requestedPage !== prevPage2) {
        $(window).scrollTop(0);
    }
    else {
        $(window).scrollTop(prevScroll2);
    }
    prevScroll2 = prevScroll;
    prevPage2 = prevPage;
    prevScroll = $(window).scrollY;
    prevPage = requestedPage;

    var hashspl = requestedPage.split('/');
    const view = hashspl.length > 1 ? hashspl[1].split('?')[0] : '';
    const querystr = hashspl.length > 1 && hashspl[1].split('?').length > 1 ? hashspl[1].split('?')[1] : '';
    $(".page-content").empty();

    if (!hashspl[0] ) {
        homeClass.LoadPage();
    }
    else {

        var evalstr = `if (typeof ` + GetClassName(hashspl[0]) + `Class !="undefined") { 
$(".main").show();` +
            GetClassName(hashspl[0]) + `Class.LoadPage(` + (querystr ? `"` + view + `",JSON.parse(\`` + ConvertQueryStringToJsonObject(querystr) + `\`)` : `"` + view + `"`)
            + `) ; } 
else {
    $(".main").hide(500, function() { $(".main").show(); $(".main").html("---");})
};
`;
        // + '") ; } else { $(".main").html("nincs ilyen") }'
        eval(evalstr);
    }

}

function ConvertQueryStringToJsonObject(queryString) {
    let jsonobj = JSON.parse('{"' + queryString.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
        function (key, value) {
            return key === "" ? value : decodeURIComponent(value);
        });

    for (var atr in jsonobj) {
        if (TryParseInt(jsonobj[atr], null) !== null) {
            jsonobj[atr] = TryParseInt(jsonobj[atr], null);
        }
    }

    return JSON.stringify(jsonobj);
}

function TryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str !== null) {
        if (str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
}

function Goto(gotopage) {
    GoTo(gotopage);
}
function GoTo(gotopage) {
    //window.location.hash = gotopage;
    AnchorClick(null, gotopage);
}

function GoogleOnSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log(id_token);
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect();

    if (googlePostProcessFunction) {
        googlePostProcessFunction(id_token, googleUser);
    }
}
function DownloadRecord(companyID, fileName) {
    // http://localhost/SendBill/UploadedDocument/Download?companyID=2&fileName=WP_20180827_11_36_19_Pro.jpg

    //var c = $(this).data('CompanyID');
    //var f = $(this).data('FileName');
    var uri = url + '/UploadedDocument/Download?companyID=' + companyID + '&fileName=' + encodeURIComponent(fileName);

    //var r = uri + '/' + encodeURIComponent(f);
    //console.log(r);
    window.open(uri);
    //var id = $(this).parents("tr").data("ID");
    //$.post(url + '/UploadedDocument/SetDownloaded', { recordID: id }, function () {
    //    RefreshUploadedDocumentList();
    //})
}

function CookieAccept() {
    var cookie = window.localStorage.getItem('cookieAccepted');
    let blockui = false;
    if (!cookie) {
        blockui = true;
        let foot = CreateGrid(1, 2);
        CreateButton({
            text: 'Elfogadás', color: _MDBcolorSec, onClick: function () {
                window.localStorage.setItem('cookieAccepted', $('#allcookie:checked').length > 0 ? 'all' : 'min');
                window.location.href = window.location.href;
                //mainClass.HideClosestModal(this);
            }
        }).AddToGrid(foot, 0, 0);

        let content = CreateGrid(4, 1);
        content.SetCellValue('Az oldal sütiket használ bővebb információért kérem olvassa el az <a data-nonavigate="true" class="akezlink pointer link">Adatkezelési tájékoztatót</a>!', 0, 0);

        let radioGrid = CreateGrid(2, 2).AddToGrid(content, 1,0);
        $(`<div class="custom-control custom-radio mt-3">
          <input type="radio" class="custom-control-input" id="allcookie" name="cookieMode" checked>
          <label class="custom-control-label" for="allcookie">Minden cookie elfogadása </label>
        </div>`).AddToGrid(radioGrid, 0, 0);
        $('<div class="mt-3">').html('Ajánlott beállítás a teljes funkciónalítás eléréséhez.').AddToGrid(radioGrid, 0, 1);
        $(`<div class="custom-control custom-radio mt-3">
          <input type="radio" class="custom-control-input" id="minimumcookie" name="cookieMode">
          <label class="custom-control-label" for="minimumcookie">Csak a kötelezőek elfogadása</label>
        </div>`).AddToGrid(radioGrid, 1, 0);
        $('<div class="mt-3">').html('Korlátozott funkciónalitás: pl.: lassabb működés, valamint a Google bejelentkezés és Barion bankkártyás fizetés sem lesz elérhető.').AddToGrid(radioGrid, 1, 1);

        $('a.akezlink').on('click', function (event) {
            event.stopPropagation();
            event.preventDefault();

            $.post(url + 'Info/GetAdatkezContent', function (res) {
                ShowInfo(res.actual.Content, "Adatkezelési tájékoztató");
            });
        });
        let dia = CreateDialog({
            noclose: true,
            dialogid: 'cookiepopup',
            header: 'Süti használat',
            content: content,
            footer: foot
        });
        mainClass.ShowModal(dia);
    }
    return blockui;
}
