$(document).on('resize', function () {
    if (loggedin) {
        $('.mdl-layout__drawer-button').show();
    }
    else {
        $('.mdl-layout__drawer-button').hide();
    }
});

pageContent = $(".page-content");


function PoolLoaded() {
    if (!layoutLoaded) {
        console.log('loading...')
        setTimeout(t => PoolLoaded(), 100);
    }
    else {
        ScriptLoaded();
    }
}

setTimeout(t => PoolLoaded(), 100);


