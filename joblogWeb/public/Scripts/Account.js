class account extends MainPageClass {
    constructor() {
        super();
        this.userroleID = userroleid; //1 könyvelő 2 user
        this.loginModal = null;
        this.AccountObject = JSON.parse(window.sessionStorage.getItem('AccountObject')) || {};
        this.regBookKeeperGuid = null;
        this.regToCompanyGuid = null;
        this.externalLoginGuid = null;

        $(document).on('click', '#btnlogin', this.Login);
        $(document).on('click', '#btnlogout', this.Logout);
    }
    LoadPage(view, param) {
        this.regBookKeeperGuid = param && param.bk ? param.bk : null;
        this.regToCompanyGuid = param && param.cg ? param.cg : null;
        if (view.toLocaleLowerCase() === 'registration') {
            AccountClass.CreateRegistrationForm();
        }
        if (view.toLocaleLowerCase() === 'resetpasswordconfirm') {
            //ShowInfo("Jelszava megváltozott!<br/>Az új jelszavával bejelentkezhet a SendBill rendszerbe. Javasoljuk belépés után változtasson jelszót.");
            this.ChangePasswordPopup(param);
        }
        else if (view.toLocaleLowerCase() === 'confirmregistration') {
            ShowInfo("Sikeresen megerősítette regisztrációját!");
        }
        else if (view.toLocaleLowerCase() === 'externalloginrequest') {
            this.externalLoginGuid = param.loginSessionGuid;
            this.ExternalLogin();
        }
        
    }

    CreateRegistrationForm() {

        if (accountClass.userroleID > 0) {
            ShowError('Jelenleg be van jelentkezve. Regisztrációhoz jelentkezzen ki, vagy használja a meglévő fiókját.');
            return;
        }

        if (this.regBookKeeperGuid) {
            $().postsync(url + '/Company/GetCompanyNameByGuid', { guid: this.regBookKeeperGuid }, function (dat) {
                if (dat.found) {
                    ShowInfo('A(z) <b>"' + dat.companyName + ' (' + dat.taxNumber + ')"</b> könyvelő megkérte, hogy csatlakozzon a SendBill rendszerhez ');
                }
                else {
                    accountClass.regBookKeeperGuid = null;
                }
            });
        }

        if (this.regToCompanyGuid) {
            $().postsync(url + '/Company/GetCompanyNameByGuid', { guid: this.regToCompanyGuid }, function (dat) {
                if (dat.found) {
                    ShowInfo('A(z) <b>"' + dat.companyName + ' (' + dat.taxNumber + ')"</b> megkérte, hogy csatlakozzon a SendBill rendszerhez, és legyen a felhasználója. ');
                }
                else {
                    accountClass.regToCompanyGuid = null;
                }
            });
        }

        let form = $('<form class="needs-validation" id="regform" novalidate>').appendTo(pageContent);
        let gridreg = CreateGrid(18, 3, 'regContainer').appendTo(form);
        gridreg.find('.column').addClass('mt-3');

        if (!this.regToCompanyGuid) {
            CreateCheckBox({ radioGroup: 'companyOrBookkeeper', label: 'Könyvelő*', properties: 'required value="bookkeeper" ' + (this.regBookKeeperGuid ? 'disabled' : '') }).AddToGrid(gridreg, 0, 1);
            CreateCheckBox({
                radioGroup: 'companyOrBookkeeper',
                label: 'Vállalkozás*',
                properties: 'required value="company" ' + (this.regBookKeeperGuid ? 'checked' : ''),
                validationFail: 'Válasszon: Könyvelőként vagy Vállalkozásként kíván regisztrálni',
                change: function (checked) {
                    if (checked && !accountClass.regBookKeeperGuid) {
                        ShowInfo('Vállalkozásként csak abban az esetben lehetséges a regisztráció, ha Könyvelője kérte fel a regisztrációra. Ebben az esetben kérje meg könyvelőjét, hogy küljön egy regisztrációs linket.', "Info");
                        $('input[name="companyOrBookkeeper"]:checked').prop('checked', false);
                    }
                }
            }).AddToGrid(gridreg, 0, 1);
        }
        CreateInput({ id: "regEmail", label: 'Email cím*', properties: 'autocomplete="new-password" required pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,4}$"', validationFail: 'Helytelen email' })
            .AddToGrid(gridreg, 1, 1);

        CreateInput({ id: "regPassword", label: 'Jelszó*', isPassword: true, properties: 'required autocomplete="new-password"' })
            .AddToGrid(gridreg, 2, 1);
        CreateInput({ id: "regPassword2", label: 'Jelszó ismét*', isPassword: true, properties: 'required autocomplete="new-password"', validationFail: 'Két azonos, legalább 6 karakter hosszú jelszó megadása kötelező' })
            .AddToGrid(gridreg, 3, 1);

        if (acceptAllCookie) {

            googlePostProcessFunction = accountClass.RegistrationGoogleLogin;
            let grdGoogle = CreateGrid(1, 2);
            grdGoogle.AddToGrid(gridreg, 4, 1);
            $("#googleLoginConatainer").show().AddToGrid(grdGoogle, 0, 0);
            grdGoogle.SetCellValue('Google bejelentkezés során az e-mail cím lesz felhasználva.', 0, 1);
        }

        if (!this.regToCompanyGuid) {
            CreateInput({ id: "regTaxNo", label: 'Adószám*', properties: 'required pattern="^[0-9]{8}(\-)[0-9]{1}(\-)[0-9]{2}$"', validationFail: 'Az adószámot xxxxxxxx-x-xx szám formátumban kell megadni' })
                .AddToGrid(gridreg, 5, 1);

            CreateInput({
                id: "regCompanyName", label: 'Cégnév*', properties: 'required', validationFail: 'Nincs kitöltve a Cégnév'
            }).AddToGrid(gridreg, 6, 1);
            CreateInput({ id: "regCompanyAddress", label: 'Cím*', properties: 'required', validationFail: 'Nincs kitöltve a Cím' }).AddToGrid(gridreg, 7, 1);
            CreateInput({ id: "regContactName", label: 'Kapcsolattartó neve' }).AddToGrid(gridreg, 8, 1);

            CreateInput({ id: "regContactPhone", label: 'Kapcsolattartó telefonszáma' }).AddToGrid(gridreg, 9, 1);
            CreateInput({ id: "regCompanyRegNo", label: 'Cégjegyzékszám' }).AddToGrid(gridreg, 10, 1);
            CreateInput({ id: "regBankAccountNumber", label: 'Számlaszám' }).AddToGrid(gridreg, 11, 1);
        }
        let chkAszf = CreateCheckBox({ label: 'Elolvastam és elfogadom az <a data-nonavigate="true" class="aszflink pointer link">ÁSZF-et</a>.*', properties: 'required', validationFail: 'Regisztráció előtt mindenképp el kell olvasni és elfogadni az ÁSZF-et!' })
            .AddToGrid(gridreg, 12, 1);
        let chkAdatkez = CreateCheckBox({ label: 'Megismertem az <a data-nonavigate="true" class="akezlink pointer link">adatkezelési tájékoztatást</a>.*', properties: 'required', validationFail: 'Regisztráció előtt mindenképp el kell olvasni az adatkezelési tájékoztatást!' })
            .AddToGrid(gridreg, 13, 1);
        let chkNewsLetter = CreateCheckBox({ id: 'chkNewsLetter', label: 'Feliratkozom a hírlevélre. Hozzájárulok a személyes adataim kezeléséhez. (E-mail cím és Cégnév kerülhet felhasználásra a hírlevelekben)' })
            .AddToGrid(gridreg, 14, 1);
        let chkDMLetter = CreateCheckBox({ id: 'chkDMLetter', label: 'Feliratkozom a reklámcélú üzeneteket is tartalmazó hírlevélre. Hozzájárulok a személyes adataim kezeléséhez. (E-mail cím és Cégnév kerülhet felhasználásra a hírlevelekben)' })
            .AddToGrid(gridreg, 15, 1);
        $('a.aszflink').on('click', function (event) {
            event.stopPropagation();
            event.preventDefault();

            $.post(url + 'Info/GetAszfContent', function (res) {
                ShowInfo(res.actual.Content, "ASZF", null,null,'lg');
            });
        });
        $('a.akezlink').on('click', function (event) {
            event.stopPropagation();
            event.preventDefault();

            $.post(url + 'Info/GetAdatkezContent', function (res) {
                ShowInfo(res.actual.Content, "Adatkezelési tájékoztató", null, null, 'lg');
            });
        });
        

        $('<div>A *-al jelölt mezők kitöltése kötelező. A bejelentkezéshez vagy email cím és jelszó, vagy google felhasználó megadása szükséges.</div>')
            .AddToGrid(gridreg, 16, 1);
        CreateButton({
            text: 'Regisztráció',
            icon: 'fas fa-user-plus',
            onClick: accountClass.RegistrationClick,
            type: 'submit'
        }).AddToGrid(gridreg, 17, 1);

    }

    RegistrationGoogleLogin(id_token, googleUser) {
        $.post(url + '/Account/PreRegistrationWithGoogle', { id_token: id_token }, function (data) {
            if (!data.error) {
                if (data.found) {
                    ShowError("Ezzel a google felhasználóval már létezik SendBill regisztráció!<br/>Válasszon másik google felhasználót, vagy adjon meg email címet és jelszót.<br/>");
                }
                else {
                    $("#regEmail").removeAttr('required');
                    $("#regPassword").removeAttr('required');
                    $("#regPassword2").removeAttr('required');
                }
            }
            else {
                ShowError('Google regisztráció közben hiba történt');
            }
        });
    }

    RegistrationClick(event) {

        event.preventDefault();
        $("#regform").addClass("was-validated");

        if ($("#regPassword").val() !== $("#regPassword2").val() || $("#regPassword").val().length<6) {
            $("#regPassword").prop('pattern', "(?=a)b");
            $("#regPassword2").prop('pattern', "(?=a)b");
        }
        else {
            $("#regPassword").removeAttr('pattern');
            $("#regPassword2").removeAttr('pattern');
        }
        if ($("#regform").get(0).checkValidity()) {
            // console.log('FromValid');
            $.post(url + 'Account/SendRegistration', {
                email: $("#regEmail").val(),
                password: $("#regPassword").val(),
                taxNumber: $("#regTaxNo").val(),
                companyName: $("#regCompanyName").val(),
                companyAddress: $("#regCompanyAddress").val(),
                contactName: $("#regContactName").val(),
                contactPhone: $("#regContactPhone").val(),
                companyRegNumber: $("#regCompanyRegNo").val(),
                bankAccountNumber: $("#regBankAccountNumber").val(),
                isBookKeeper: $('input[name="companyOrBookkeeper"]:checked').val() === 'bookkeeper',
                bookKeeperGuid: accountClass.regBookKeeperGuid,
                regToCompanyGuid: accountClass.regToCompanyGuid,
                newsLetter: $("#chkNewsLetter:checked").length > 0,
                eDMLetter: $("#chkDMLetter:checked").length > 0,
            },
            function (data) {
                if (data === 'userRegistered') {
                    ShowError('Ezzel az email címmel már regisztráltak');
                }
                else if (data === 'error') {
                    ShowError('Regisztráció sikertelen');
                } else if (data) {
                    ShowInfo('Regisztráció sikeres<br/>A megadott email címre küldött link segítségével erősítse meg a regisztrációját, különben a regisztráció 36 órán belül törlődni fog!', null, null, function () {
                        Goto('');
                        AccountClass.LoggedInPostProcess(data.roleid);
                        window.sessionStorage.setItem('AccountObject', JSON.stringify(data));
                        AccountClass.AccountObject = data;
                    });
                }
            });
        }
        else {
            console.log('FromInValid');
        }
        //$("#regContainer").find('input').removeClass('is-invalid');
        //if ($("#regEmail").val().length === 0) {
        //    $("#regEmail").addClass('is-invalid');
        //}
    }

    SetItemToRole() {
        $("[data-attr-showonrole]").each(function () {
            //Log(this)
            var roles = $(this).attr('data-attr-showonrole').split(",");
            $(this).toggle(roles.filter(f => parseInt(AccountClass.userroleID) === parseInt(f)).length > 0);
        });
        HashChange();
    }
    Login(event, isExternalLogin) {
        var content = $("<div>");

        if (isExternalLogin) {
            $('<h1 class=m-3>').html('SendBill bejelentkezés').appendTo(content);
        }

        CreateInput({ label: "Email cím", id:"txtloginemail", class:'mb-5' }).appendTo(content);
        CreateInput({ label: "Jelszó", isPassword: true, id: "txtloginpassword", class: 'mb-5' }).appendTo(content);
        $("#googleLoginConatainer").show().appendTo(content);
        var footer = $('<div>');
        CreateButton({ text: "Belépés", onClick: AccountClass.LoginClick, icon: 'fas fa-sign-in-alt' }).appendTo(footer);

        if (!isExternalLogin) {
            CreateButton({
                text: "Mégsem", onClick: AccountClass.HideLoginDialog, icon: 'fas fa-ban', color: _MDBcolorSec
                }).appendTo(footer);
            AccountClass.loginModal = CreateDialog({ header: 'Bejelentkezés', content: content, size: 'modal-sm', footer: footer });
        }
        googlePostProcessFunction = AccountClass.LoginWithGoogle;
        $('<br/>').appendTo(content);
        $('<a data-nonavigate="true" class="pointer" style="color:blue">Elfejeltett jelszó</a>').appendTo(content).on('click', AccountClass.ShowPasswordResetPopup);

        if (!isExternalLogin) {
            super.ShowModal(AccountClass.loginModal);
        }
        else {
            content.appendTo(pageContent);
            footer.appendTo(pageContent);
        }
    }

    ShowPasswordResetPopup() {
        let grid = CreateGrid(2, 1);
        $(`<div>Adja meg az email címet amelyhez új jelszót szeretne igényelni, majd nyomja meg a Jelszó visszaállítás gombot.<br/>
Amennyiben Google fiokkal jelentkezett be korábban, úgy az elfelejtett jelszó helyreállítását a Google-nél kezdeményezheti.
</div>`).AddToGrid(grid, 0, 0);
        CreateInput({id:"resetPasswordEmail", label: "Email cím" }).AddToGrid(grid, 1, 0);
        var footer = $('<div>');
        CreateButton({ text: "Küldés", onClick: AccountClass.PasswordResetSend }).appendTo(footer);
        CreateButton({
            text: "Mégsem", onClick: function () { mainClass.HideClosestModal($("#passwordResetPopup")); }, icon: 'fas fa-ban', color: _MDBcolorSec
        }).appendTo(footer);
        let dia = CreateDialog({ dialogid: 'passwordResetPopup', content: grid, header: "Elfelejtett jelszó", footer: footer });
        mainClass.ShowModal(dia);
        mainClass.HideModal(AccountClass.loginModal);
    }

    PasswordResetSend() {
        if (validateEmail($("#resetPasswordEmail").val())) {
            $.post(url + 'Account/ResetPassword', { email: $("#resetPasswordEmail").val() }, function (res) {
                if (res === 'ok') {
                    ShowInfo('Hamarosan Email fog érkezni a megadott email címre.');
                    mainClass.HideModal($("#passwordResetPopup"));
                }
                else if (res === 'emailnotfound') {
                    ShowError('A megadott email címmel felhasználó nem található.');
                    mainClass.HideModal($("#passwordResetPopup"));
                }
                else if (res === 'error') {
                    ShowError('Email küldés közben hiba történt.');
                    mainClass.HideModal($("#passwordResetPopup"));
                }
            });
        }
        else {
            ShowError("Email cím nem megfelelő.");
        }
    }

    LoginWithGoogle(id_token, googleUser) {
        $.post(url + '/Account/LoginWithGoogle', { id_token: id_token, externalLoginGuid: AccountClass.externalLoginGuid }, function (data) {
            if (data.allow) {
                AccountClass.LoggedInPostProcess(data.roleid);
                window.sessionStorage.setItem('AccountObject', JSON.stringify(data));
                AccountClass.AccountObject = data;
                if (!data.confirmed) {
                    ShowInfo('A felhasználó e-mail címe nem lett megerősítve, ezért bizonyos funkciók korlátozásra kerülnek.', "Figyelem");
                }
            } 
            else {
                ShowError('Ez a google felhasználó nem található a SendBill rendszerben!');
            }
        });
    }

    HideLoginDialog() {
        AccountClass.HideModal(AccountClass.loginModal);
    }

    LoginClick() {
        var isinvalid = false;
        if ($("#txtloginemail").val() === '') {
            $("#txtloginemail").parent().addClass('is-invalid');
            isinvalid = true;
            $("#loginerrortext").html('Kötelező');
        }
        if ($("#txtloginpassword").val() === '') {
            $("#txtloginpassword").parent().addClass('is-invalid');
            isinvalid = true;
        }

        if (isinvalid) return;
        $("#txtloginemail").removeClass('is-invalid');
        $("#txtloginpassword").removeClass('is-invalid');


        var email = $("#txtloginemail").val();
        var pass = $("#txtloginpassword").val();
        $.post(url + '/Account/Login', { email: email, password: pass, externalLoginGuid: accountClass.externalLoginGuid }, function (data) {

            if (data.allow) {
                AccountClass.LoggedInPostProcess(data.roleid);
                window.sessionStorage.setItem('AccountObject', JSON.stringify(data));
                AccountClass.AccountObject = data;
                if (!data.confirmed) {
                    ShowInfo('A felhasználó e-mail címe nem lett megerősítve, ezért bizonyos funkciók korlátozásra kerülnek.', "Figyelem");
                }
                //if (data.guid !== '') {
                //   // window.location = url + '/Account/LoginWithACG?guid=' + data.guid;
                //}
                //else {
                    
                //    //loggedin = true;
                //    //userroleid = data.roleid;
                //    //var dialog = document.querySelector('dialog');
                //    //dialog.close();
                //    //LoginSuccess(true);
                //}
            }
            else {
                //ShowError('Helytelen e-mail cím vagy jelszó!');
                $("#txtloginemail").parent().addClass('is-invalid');
                $("#loginerrortext").html('Érvénytelen e-mail cím vagy jelszó!');
                $("#txtloginemail, #txtloginpassword").on('focus', function () {
                    $(this).val('');
                    $("#txtloginemail, #txtloginpassword").off('focus');
                });
            }
        });
    } 
    LoggedInPostProcess(roleid) {
        loggedin = true;
        AccountClass.userroleID = userroleid = roleid;
        AccountClass.HideLoginDialog();
        Goto('');
        AccountClass.SetItemToRole();
        uploadedDocumentClass.LoadDocumentTypeList();
        
    }
    Logout() {
        $.post(url + '/Account/Logout', function () {
            AccountClass.userroleID = userroleid = 0;

            $("#googleLoginConatainer").appendTo("#googleLoginConatainerContainer");
            Goto('');
            AccountClass.SetItemToRole();
            window.sessionStorage.removeItem('AccountObject');
            AccountClass.AccountObject = {};

        });
    }

    CompanyUserPopup() {

        $.post(url + 'Account/GetUserForCompany', function (res) {
            let cols = [{
                field: 'EmailAddress',
                header: 'E-mail cím',
                formatter: function (inp, data) {
                    if (data.hasGoogleAccount && (!inp || inp === '')) {
                        return '[Google fiók]';
                    }
                    return inp;
                }
            }];
            let cbutton = new tableColumn();
            cols.push(cbutton);
            cbutton.field = "";
            cbutton.header = "";

            cbutton.formatter = function (inp, data) {
                let grdDel = CreateGrid(1, 2);

                CreateButton(x => {
                    let s = new buttonSetting();
                    s.iconstyle = true;
                    s.icon = "fas fa-trash";
                    s.onClick = function () {
                        if (res.length > 1) {
                            $.post(url + 'account/DeleteUser', { guid: data.Guid }, function () {
                                ShowInfo('Felhasználó eltávolítva!', null, null, function () {
                                    mainClass.HideClosestModal($("#diacompSettingUsers"), null, function () {
                                        if (data.isThisUser) {
                                            accountClass.Logout();
                                        }
                                    });
                                });
                            });
                        }
                        else {
                            ShowError('A cég egyetlen felhasználóját nem lehet törölni, ebben az esetben használja a cég törlése lehetőséges!');
                        }
                    };

                    return s;
                }).AddToGrid(grdDel, 0, 0);

                if (data.isThisUser) {
                    grdDel.SetCellValue('Bejelentkezett felhasználó',0,1);
                }
                return grdDel;
            };

            let googleButton = new tableColumn();
            cols.push(googleButton);
            googleButton.field = "";
            googleButton.header = "";


            googleButton.headerformatter = function () {
                return CreateButton(x => {
                    let bs = new buttonSetting();
                    bs.text = "Meghívó küldése";
                    bs.icon = "fas fa-user-plus";
                    bs.onClick = function () {

                        if (!accountClass.AccountObject.confirmed) {
                            ShowInfo('A felhasználó e-mail címe nem lett megerősítve, ezért nem lehetséges új felhasználói fiókot rögzíteni!', "Figyelem");
                        }
                        else {

                            let content = CreateInput({ id: "joinUserEmail", label: "E-mail cím" });

                            let joinDiaFooter = CreateGrid(1, 1);

                            CreateButton(x => {
                                let bsj = new buttonSetting();
                                bsj.onClick = function () {
                                    let emil = $("#joinUserEmail").val();
                                    if (validateEmail(emil)) {
                                        $.post(url + 'Account/SendJoinRequestToUser', { email: emil }, function () {
                                            ShowInfo('Meghívó elküldve', null, null, function () {
                                                mainClass.HideClosestModal($("#joinUserEmail"));
                                            });
                                        });
                                    }
                                    else {
                                        ShowError('E-mail cím formailag helytelen');
                                    }
                                };
                                bsj.text = "Meghívó küldése";
                                return bsj;
                            }).AddToGrid(joinDiaFooter, 0, 0);

                            CreateButton({ text: 'Bezár', color: _MDBcolorSec, onClick: function () { mainClass.HideClosestModal(this); } }).AddToGrid(joinDiaFooter, 0, 0);

                            let dia = CreateDialog({ dialogid: "diaCreateUserJoinRequest", header: "Felhasználó meghívása", content: content, footer: joinDiaFooter });
                            mainClass.ShowModal(dia);
                        }
                    };
                    return bs;
                });
            };

            googleButton.formatter = function (inp, data) {
                if (data.isThisUser) {
                    if (data.hasGoogleAccount) {
                        if (data.EmailAddress)
                        return CreateButton({ id: "googleUnlinkButton", text: "Google szétkapcsolás", onClick: companyClass.UnlinkGoogle });
                    } 
                    else {
                        let d = $('<div>');
                        $("#googleLoginConatainer").show().appendTo(d);
                        return d;
                    }                    
                }
            };

            let content = CreateGrid(3, 1)

            CreateTable({ data: res, columns: cols }).AddToGrid(content,0,0);

            content.SetCellValue('Törléskor a fejlhasználó E-mail címe és jelszava került törlésre.', 1, 0);

            CreateButton({
                text: 'Jelszóvltoztatás', onClick: accountClass.ChangePasswordPopup
            }).AddToGrid(content, 2, 0);

            //let content = CreateGrid(res.length, 2);

            //for (var i = 0; i < res.length; i++) {
            //    content.SetCellValue(res[i].EmailAddress, i, 0);
            //}

            let grd = CreateDialog({ dialogid:"diacompSettingUsers", content: content, setCloseButtonToFooter: true });
            mainClass.ShowModal(grd);
        });
    }

    ChangePasswordPopup(parameter) {
        let content = CreateGrid(3, 1);
        CreateInput({ label: "Jelenlegi jelszó", id: "changePasswordOld", type: "password", hide: parameter }).AddToGrid(content, 0);
        CreateInput({ label: "Új jelszó", id: "changePasswordNew", type: "password" }).AddToGrid(content, 1);
        CreateInput({ label: "Új jelszó ismét", id: "changePasswordNew2", type: "password" }).AddToGrid(content, 2);

        let footer = CreateGrid(1, 2);
        CreateButton({
            text: "Mentés", onClick: function () {
                if ($("#changePasswordNew").val().length < 6) {
                    ShowError('Az új jelszó legalább 6 karakter hosszú legyen');
                } else if ($("#changePasswordNew").val() !== $("#changePasswordNew2").val()) {
                    ShowError('Két jelszó nem egyezik');
                }
                else {
                    $.post(url + 'Account/ChangePassword',{
                        oldPassword: $("#changePasswordOld").val(),
                        newPassword: $("#changePasswordNew").val(),
                        guid: parameter.guid,
                        guidV: parameter.guidV
                    }).done(d => {
                        if (d) {
                            ShowInfo("Jelszava megváltozott!", null, null, function () {
                                mainClass.HideModal($(".createdDialog"));
                            })
                        }
                        else {
                            if (!parameter) {
                                ShowError('A jelenlegi jelszó helytelen!');
                            }
                            else {
                                ShowError('A jelszó változtatása nem lehetséges!');
                            }
                        }
                    })

                }
            }}).AddToGrid(footer, 0, 0);
        CreateButton({ text: "Mégse", color: _MDBcolorSec, onClick: 'hide' }).AddToGrid(footer, 0, 1);

        let dia = CreateDialog({ content: content, header: "Jelszóváltoztatás", footer: footer });
        mainClass.ShowModal(dia);
    }

    ExternalLogin() {
        $(".navbar, .page-footer").remove();
        accountClass.Login(null, true);
    }
}

var AccountClass = new account();
var accountClass = AccountClass;