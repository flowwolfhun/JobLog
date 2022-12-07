class MainPageClass {
    constructor() {
        this._errorpopup = null;
        this._infopopup = null;
        this._contents = {};

        AddClassName(this.__proto__.constructor.name);
        //console.log(this.__proto__.constructor.name);
    }

    Log(message) {
        Log(message);
    }
    ShowModal(popup) {
        popup.modal('show');
    }
    HideModal(popup, callback) {
        if (popup) {
            popup.modal('hide');
        }
        if (callback) {
            callback();
        }
    }
    HideClosestModal(caller, selector, callback) {
        selector = selector || '.createdDialog';
        
        var popup = $(caller).closest(selector);
        if (popup) {
            popup.modal('hide');
        }
        if (callback) {
            callback();
        }
    }
}
function Log(message) {
    console.log(message);
}
function Warning(message) {
    console.log(message);
}
function Error(message) {
    console.log(message);
}

var mainClass = new MainPageClass();