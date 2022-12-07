class home extends MainPageClass {
    constructor() {
        super();
    }
    LoadPage(view, parameter) {
        if (!view || view === '') {
            this.CreateLayout();
        }
        else if (view.toLocaleLowerCase() === "filenotfoundoraccessdenied") {
            ShowError('File nem található, vagy nincs jogosultság a megtekintéshez!');// console.log('Home/' + view);
        }
    }
    CreateLayout() {

    }
}
const homeClass = new home();