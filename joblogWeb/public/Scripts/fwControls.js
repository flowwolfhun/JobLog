var confirmDialog = null;
function CreateCheckBox(setting) {
    setting.id = setting.id || 'chk' + NewGuid();
    setting.class = setting.class || '';
    setting.radioGroup = setting.radioGroup ? 'name="' + setting.radioGroup + '"' : '';
    let type = setting.radioGroup ? 'radio' : 'checkbox';
    setting.validationFail = setting.validationFail ? '<div class="invalid-feedback">' + setting.validationFail + '</div>' : '';
    const chk = $(`<div class="custom-control custom-checkbox">
            <input type="`+ type + `" ` + setting.radioGroup + ' ' + setting.properties + ` class="custom-control-input ` + setting.class + `" id="` + setting.id + `" ` + (setting.readonly ? ' onclick="return false"' : '') + (setting.checked ? ' checked' : '') + `>
            <label class="custom-control-label " for="` + setting.id + `">` + setting.label + `</label>` +
            setting.validationFail+`
        </div>`);
    if (setting.change) {
        chk.find('input').on('change', function () {
            setting.change($(this).is(':checked'));
        });
    }
    setting.control = chk;
    return chk;
}
function CreateDialog(setting) {
    setting.header = setting.header || '';
    setting.content = setting.content || '';
    setting.footer = setting.footer || '';
    setting.noclose = setting.noclose ? 'data-backdrop="false" data-keyboard="false"' : '';
    if (setting.setCloseButtonToFooter) {
        setting.footer = CreateGrid(1, 1);
        CreateButton({ text: 'Bezár', color: _MDBcolorSec, onClick: function () { mainClass.HideClosestModal(this); } }).AddToGrid(setting.footer, 0, 0);
    }


    setting.dialogid = setting.dialogid || 'dialogpopup';
    $("#" + setting.dialogid).remove();
    setting.size = setting.size || 'modal-lg';
    var dialogString = `<div ` + setting.noclose+` class="modal fade createdDialog" id="` + setting.dialogid + `" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog `+ setting.size + `" role="document">
        <div class="modal-content">
          <div class="modal-header white-text `+ _MDBcolor + `">
            <h4 class="modal-title" id="exampleModalLabel">`+ setting.header + `</h4>

          </div>
          <div class="modal-body">
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>`;
    const modal = $(dialogString).appendTo($('.dialog-content'));
    $("#" + setting.dialogid).find('.modal-body').empty();
    $("#" + setting.dialogid).find('.modal-body').append(setting.content);
    $("#" + setting.dialogid).find('.modal-footer').empty();
    $("#" + setting.dialogid).find('.modal-footer').append(setting.footer);
    return modal;
}
function CreateInput(setting) {
    setting = setting || {};
    var label = setting.label || '';
    setting.isPassword = !!setting.isPassword;
    setting.readonly = !!setting.readonly;
    setting.preprendItem = setting.preprendItem || '';
    setting.appendItem = setting.appendItem || '';    
    
    setting.value = setting.value ? 'value="' + setting.value + '"' : '';
    setting.class = setting.class || '';
    setting.hide = !!setting.hide;

    setting.validationFail = setting.validationFail ? '<div class="invalid-feedback">' + setting.validationFail + '</div>' : '';
    var labelActiveClass = setting.value ? 'class="active"' : '';
    var placeholder = setting.placeholder = setting.placeholder || '';
    var id = setting.id;
    var inlinelabel = !!setting.inlinelabel;
    if (label === null || label === undefined) label = '';
    if (placeholder === null || placeholder === undefined) placeholder = label;
    if (id === null || id === undefined) id = '';
    
    if (!setting.type) {
        setting.type = 'text';
    }
    headerwith = '';
    if (setting.headerwith) {
        headerwith = 'style="width:' + setting.headerwith + 'px"';
    }

    var labelEnd = ':';
    if (setting.labelEnd !== undefined) {
        labelEnd = setting.labelEnd;
    }

    if (inlinelabel) {
        var div = $('<div class="input-group mb-3"></div>');

        if (!setting.noheader)
            $('<div class= "input-group-prepend" >' +
                '<span ' + headerwith + ' class="input-group-text" id="basic-addon1">' + label + labelEnd + '</span>' +
                '</div >').appendTo(div);

        var readonlytext = setting.readonly ? 'readonly' : '';
        if (!setting.properties) {
            setting.properties = '';
        }
        let tagstring = 'input';
        if (setting.multiline) {
            tagstring = 'textarea';
        }
        var input = $('<' + tagstring + ' ' + setting.properties + ' ' + setting.value + ' type="' + setting.type + '" id="' + id + '" class="form-control" placeholder="' + placeholder + '" aria-label="' + placeholder + '" aria-describedby="basic-addon1" ' + readonlytext + '>')
            .appendTo(div);
        if (setting.change) {
            input.on('change', setting.change);
        }
        if (setting.keyup) {
            input.on('keyup', setting.keyup);
        }
        if (setting.enterToNextInput) {
            input.on('keyup', function (event) {
                if (event.keyCode === 13) {
                    var _thisinp = $(this);
                    var focusnext = false;
                    $("input.form-control:reallyvisible").each(function () {

                        if (focusnext) {
                            $(this).focus();
                            focusnext = false;
                        }
                        if ($(this).is(_thisinp)) {
                            focusnext = true;
                            if ($("input.form-control:reallyvisible").last().is($(this))) {
                                $(".defaultenterbutton").focus();
                            }
                        }
                    });
                }
            });
        }


        if (setting.validationErrorMessage) {
            input.data('validationErrorMessage', setting.validationErrorMessage);
        }
        //if (setting.value) {
        //    input.val(setting.value);
        //}
        else if (setting.emptyvalue) {
            input.val(setting.emptyvalue);
        }


        return $(div);
    }
    else {
        var inp = $('<div id="div' + id + '" class="input-group md-form ' + setting.class + '">' +
            setting.preprendItem +
            '<input class="form-control" type = "' + (setting.isPassword ? "password" : setting.type) + '" id="' + id + '" ' + (setting.readonly ? "readonly" : "") + ' ' + setting.value +
            'placeholder="' + setting.placeholder + '"' + ' ' + setting.properties +
            ' >' + setting.validationFail+
            '<label for="' + id + '" ' + labelActiveClass + '>' + label + '</label>' +
            setting.appendItem +
            '</div >');
        if (setting.hide) {
            inp.hide();
        }
        return inp;
    }
}
function CreateButton(setting) {
    // setting.icon
    // setting.text,
    //setting.onClick
    if (typeof (setting) === 'function') {
        setting = setting();
    }
    setting.id = setting.id ? 'id="' + setting.id + '"' : 'id=btn' + NewGuid();
    setting.color = setting.color || _MDBcolor;
    setting.class = setting.class || '';
    setting.iconstyle = !!setting.iconstyle;
    setting.type = setting.type || 'button';
    var btn = null;

    if (!setting.iconstyle) {
        btn = $("<button " + setting.id + " type='" + setting.type + "'>").addClass("waves-effect btn " + setting.color + " " + setting.class + " btn btn-sm");



        if (setting.icon) {
            btn.append($('<i class="' + setting.icon + ' pr-2" aria-hidden="true" ></i>'));
        }
        if (setting.text) {
            btn.append(setting.text);
        }

        if (setting.class) {
            btn.addClass(setting.class);
        }
    }
    else {
        btn = $('<i class="' + setting.icon + ' pointer" aria-hidden="true"></i>');
    }

    if (setting.onClick === 'hide') {
        setting.onClick = function () {
            mainClass.HideClosestModal(this);
        }
    }

    if (setting.onClick) {
        if (setting.clickData) {
            btn.on('click', function () { setting.onClick(setting.clickData); });
        } else {
            btn.on('click', setting.onClick);
        }
    }
    return btn;
}

function CreateFileInput(setting) {
    setting = setting || {};
    setting.id = setting.id || 'fileinp' + NewGuid();
    let input = $(`<div class="custom-file pointer">
              <input type="file" class="custom-file-input" style="display:hidden" id="`+setting.id+`">
            </div>`);
    let field = CreateInput({ id: 'file' + setting.id, readonly: true, placeholder: 'File', appendItem: '<i class="fas fa-paperclip prefix right color-black" aria-hidden="true"></i>' }).appendTo(input);
    field.on('click', function (e) {
        $("#"+setting.id).click();
    });
    $(input).appendTo($('.tempContainer'));
    $("#" + setting.id).change(function (e) {
        var fileName = e.target.files && e.target.files.length>0 ? e.target.files[0].name : '';
        $("#file" + setting.id).val(fileName);
        if (setting.change) {
            setting.change(e);
        }
    });

    return input;
}

function RefreshTable(table) {
    CreateTable(table.data('setting'));
}

function CreateTable(setting) {
    let id = "";
    if (setting.id) {
        id = 'id="' + setting.id + '"';
    }
    var tab = $('<table ' + id + ' class="table createdtable">');
    
    var filterrow = null;
    var headerstyle = '';

    if (setting.dataurl) {

        for (const paramCol of setting.columns.filter(fsc => !!fsc.filterServerSideMap)) {
            if (paramCol.filtertype === 'daterange') {

                setting.parameter[paramCol.filterServerSideMap.start] = paramCol.filtercurrentvalue.start.format('YYYY.MM.DD');
                setting.parameter[paramCol.filterServerSideMap.end] = paramCol.filtercurrentvalue.end.format('YYYY.MM.DD');
            }
        }

        $().postsync(setting.dataurl, setting.parameter, function (resultData) {
            setting.data = resultData;
        });
    }

    tab.data('setting', setting);

    if (setting.headerstyle ) {
        headerstyle = setting.headerstyle;
    }

    if (setting.itemSelect) {
        setting.columns.unshift({
            formatter: function (input, data) {
                let dd = CreateCheckBox({
                    label: '',
                    id: 'chkTableSelection' + data.ID,
                    class: 'chkTableSelection',
                    change: function (state) {
                        tab.GetSelectedTableRows(setting.itemSelectCallback);
                        //const _t = this;
                        //data.ID
                    }
                });
                dd.data('ID', data.ID);
                return dd;
            },
            headerformatter: function () {
                return CreateCheckBox({
                    label: '',
                    change: function (state) {
                        $('.chkTableSelection').prop('checked', false);
                        $('.chkTableSelection:visible').prop('checked', state);
                        tab.GetSelectedTableRows(setting.itemSelectCallback);
                        //tab.GetSelectedTableRows(setting.itemSelectCallback);
                        //const _t = this;
                        //data.ID
                    }
                });
            }
        });
    }
    let head = $('<thead class="' + headerstyle + '">').appendTo(tab);
    if (setting.columns) {
        // let head = $('<thead class="' + headerstyle + '">').appendTo(tab);
        let hrow = $('<tr>').appendTo(head);
        filterrow = $('<tr>');//.appendTo(head);
        var anyfilter = false;
        for (var i = 0; i < setting.columns.length; i++) {

            const th = $('<th>').appendTo(hrow);
            if (setting.columns[i].headerformatter) {
                th.html(setting.columns[i].headerformatter());
            }
            else {
                th.html(setting.columns[i].header);
            }

            anyfilter = anyfilter || setting.columns[i].filter;

            let filtcell = $('<td ' + (setting.columns[i].filterTooltip ? 'title="' + setting.columns[i].filterTooltip + '"' : '') + '>').appendTo(filterrow);
            if (setting.columns[i].class) {
                filtcell.addClass(setting.columns[i].class);
            }

            if (setting.columns[i].filterTooltip) {
                filtcell.tooltip();
            }

            if (setting.columns[i].class) {
                th.addClass(setting.columns[i].class);
            }
        }
        if (anyfilter) {
            filterrow.prependTo(head);
        }
        //filterrow.find('td').each(function () {
        //    CreateDropDown({ list: ['a', 'b'] }).appendTo($(this));
        //});


    }

    if (setting.holder) {
        setting.holder.empty();
        tab.appendTo(setting.holder);
    }
    var startTimeCol = new Date();
    if (setting.data && setting.columns) {
        var tbody = setting.tableBody = $('<tbody>').appendTo(tab);

        //for (var data of setting.data) {
        for (var dataindex = 0; dataindex < setting.data.length; dataindex++) {
            var startTimeDataindex = new Date();
            let data = setting.data[dataindex];
            data.hideData = {};
            let row = $('<tr>').appendTo(tbody);

            row.data('rowindex', dataindex);

            if (setting.onclick) {
                row.addClass('pointer');
                
                row.on('click', function () {
                    let sett = $(this).parents('table.createdtable').data('setting');
                    let ro = sett.data[$(this).data('rowindex')];
                    sett.onclick(ro);
                });
            }

            if (setting.ondblclick) {
                row.addClass('pointer');

                row.on('dblclick', function () {
                    let sett = $(this).parents('table.createdtable').data('setting');
                    let ro = sett.data[$(this).data('rowindex')];
                    sett.ondblclick(ro);
                });
            }

            for (var c = 0; c < setting.columns.length; c++) {
                let col = setting.columns[c];
                let colvalue = '';
                if (col.fixtext) {
                    colvalue = col.fixtext;
                } else {
                    colvalue = data[col.field];
                }
                if (col.islinkcol) {
                    colvalue = '<a data-nonavigate="true" class="pointer linkstyle">' + colvalue + '</a>';
                }
                if (col.formatter) {
                    colvalue = col.formatter(colvalue, data);
                }

                var cell = $('<td ' + (col.tooltipfield ? 'data-placement="top" title="' + data[col.tooltipfield]+'"':'' )+'>').appendTo(row);

                if (col.class) {
                    cell.addClass(col.class);
                }

                var celldiv = $('<div>').appendTo(cell).html(colvalue);
                celldiv.data('rowindex', dataindex);
                if (col.onclick) {
                    celldiv.on('click', function () {
                        let sett = $(this).parents('table.createdtable').data('setting');
                        let ro = sett.data[$(this).data('rowindex')];
                        col.onclick(ro);
                    });
                }


                if (col.tooltipfield) {
                    cell.tooltip();
                }

                if (col.class) {
                    cell.addClass(col.class);
                }

                if (col.filter) {
                    if (!col.filtervalues) {
                        col.filtervalues = [{ key: 'allvalue', value: 'Mind' }];
                    }
                    if (col.filtervalues.filter(f => f.key === data[col.field]).length === 0) {
                        col.filtervalues.push({ key: data[col.field], value: data[col.field] });
                    }

                    data.hideData[col.field] = {};

                }
            }

            var endTimeDataIndex = new Date();
            var timeDiff = endTimeDataIndex - startTimeDataindex; //in ms
            // strip the ms
            timeDiff /= 1000;

            // get seconds 
            var seconds = Math.round(timeDiff);
            console.log(seconds + " DataIndex seconds");
        }
        for (let cf = 0; cf < setting.columns.length; cf++) {

            var startTimeSettCols = new Date();
            let cfcol = setting.columns[cf];
            if (cfcol.filter) {
                cfcol.filtertype = cfcol.filtertype || 'dropdown';
                if (cfcol.filtertype === 'daterange') {
                    CreateDateRangePicker({
                        start: cfcol.filtercurrentvalue.start,
                        end: cfcol.filtercurrentvalue.end,
                        onSelect: cfcol.filterServerSideMap ? function (start, end, label) {
                            const thisColumn = cfcol;
                            if (thisColumn.filterServerSideMap) {
                                let ct = setting.columns.find(fc => fc.field === thisColumn.field);
                                ct.filtercurrentvalue.start = start;
                                ct.filtercurrentvalue.end = end;
                            }
                            CreateTable(setting);
                        } : function () {
                            console.error('Table dropdown csak server side van implementálva')
                        }
                    }).appendTo(filterrow.find('td')[cf]);
                    //CreateButton({
                    //    text: 'dsadas',
                    //    onClick: function () {
                    //        FWDatePicker.show(this);
                    //    }
                    //}).appendTo(filterrow.find('th')[cf]);
                }
                else if (cfcol.filtertype === 'dropdown' && cfcol.filtervalues && cfcol.filtervalues.length > 0) {
                    if (cfcol.formatter) {
                        for (let cfcolfv of cfcol.filtervalues) {
                            cfcolfv.value = cfcol.formatter(cfcolfv.value);
                        }
                    }
                    CreateDropDown({
                        label: '',
                        list: cfcol.filterOption || cfcol.filtervalues,
                        key: 'key',
                        value: 'value',
                        defaultId: cfcol.filtercurrentvalue || 'allvalue',
                        selectitemcallback: function (selectedValue) {
                            const thisColumn = cfcol;
                            let ct = setting.columns.find(fc => fc.field === thisColumn.field);
                            ct.filtercurrentvalue = selectedValue.key;
                            let rows = setting.tableBody.find('tr');
                            if (selectedValue.key === 'allvalue') {
                                // rows.show();
                                for (let dataToShow of setting.data) {
                                    dataToShow.hideData[thisColumn.field].hidden = false;
                                }
                            }
                            else {
                                for (let rr of rows) {
                                    let rindex = $(rr).data('rowindex');
                                    let dr = setting.data[rindex];

                                    // $(rr).toggle(dr.DocumentTypeID === selectedValue.key);
                                    setting.data[rindex].hideData[thisColumn.field].hidden = dr.DocumentTypeID !== selectedValue.key;
                                }
                            }
                            TableSetRowVisibility(tab);
                        }
                    }).appendTo(filterrow.find('td')[cf]);
                }
                else if (cfcol.filtertype === 'switch') {
                    CreateSwitch({
                        checked: cfcol.filtercurrentvalue,
                        change: function (state) {
                            const thisColumn = cfcol;
                            let ct = setting.columns.find(fc => fc.field === thisColumn.field);
                            ct.filtercurrentvalue = state;
                            let rows = setting.tableBody.find('tr');
                            for (let rr of rows) {
                                let rindex = $(rr).data('rowindex');
                                let dr = setting.data[rindex];

                                if (cfcol.filterFunction) {
                                    // $(rr).toggle(cfcol.filterFunction(state, dr));
                                    
                                    setting.data[rindex].hideData[thisColumn.field].hidden = !cfcol.filterFunction(state, dr);
                                }
                            }
                            TableSetRowVisibility(tab);
                        }
                    }).appendTo(filterrow.find('td')[cf]);
                }
            }
            var endTimeSettCols = new Date();
            var timeDiffSettCols = endTimeSettCols - startTimeSettCols; //in ms
            // strip the ms
            timeDiffSettCols /= 1000;

            // get seconds 
            var secondsSettCols = Math.round(timeDiffSettCols);
            console.log(secondsSettCols + " SettCols seconds");
            if (secondsSettCols > 0) {
                console.log(setting.columns[cf])
            }

        }
        tab.find('.custom-select').removeClass('custom-select');
    }

    var endTimeCol = new Date();
    var timeDiff = endTimeCol - startTimeCol; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds 
    var seconds = Math.round(timeDiff);
    console.log(seconds + " COl seconds");

    if (setting.headerFilterMinSize) {



        let mobileFilterholder = $("<div class='tableFilterHolder'></div>").prependTo(setting.holder || setting.headerFilterMinSize.holder);

    //    $(`<button class="btn btn-primary" type="button" data-toggle="collapse" data-target=".toggle-filter"
        //aria-expanded="false" aria-controls="multiCollapseExample2">Toggle second element</button>`).appendTo(mobileFilterholder);
        CreateButton({ text: "szűrés", icon: 'fas fa-filter' }).appendTo(mobileFilterholder)
            .attr('data-target', ".toggle-filter")
            .attr('data-toggle', "collapse");
            

        let mobileFilterGrid = CreateGrid(setting.columns.length, 2).appendTo(mobileFilterholder);
        mobileFilterGrid.addClass('toggle-filter collapse');

        var funres = function (ev) {
            //console.log(ev.detail);
            if (ev.detail.width < setting.headerFilterMinSize.size) {
                let headcols = $(filterrow).children('td');

                for (let headcolsIndex = 0; headcolsIndex < headcols.length; headcolsIndex++) {
                    if ($(headcols[headcolsIndex]).children().length > 0) {
                        $('<div>' + setting.columns[headcolsIndex].header + ':</div>').AddToGrid(mobileFilterGrid, headcolsIndex, 0);
                        $(headcols[headcolsIndex]).children().AddToGrid(mobileFilterGrid, headcolsIndex, 1);
                    }
                }
            }
            else {
                let headcols = $(filterrow).children('td');
                for (let headcolsIndex = 0; headcolsIndex < headcols.length; headcolsIndex++) {
                    mobileFilterGrid.GetCellValue(headcolsIndex, 0).empty();
                    mobileFilterGrid.GetCellValue(headcolsIndex, 1).children().appendTo($(headcols[headcolsIndex]));
                }
            }

        };

        document.addEventListener('resizewindow', funres);
        funres({ detail: { width: window.innerWidth, height: window.innerHeight } });
    }

    if (setting.pager) {

        //let visibleDataCount = setting.holder.find('tbody tr:visible').length;
        //let pageNumber = Math.floor(visibleDataCount / setting.pager.size)+1;
        //if (pageNumber * setting.pager.size < visibleDataCount) {
        //    pageNumber + 1;
        //}

        setting.pager.currentpageindex = setting.pager.currentpageindex || 0;
        setting.pager.size = setting.pager.size || 5;
        let pager = $('<tfoot class="' + headerstyle + '">').appendTo(tab);
        let pagercell = $('<td colspan="' + setting.columns.length + '">').appendTo(pager);
        let prow = $('<div class="row">').appendTo(pagercell);
        let ddDiv = $('<div class="col-sm">').appendTo(prow);
        CreateDropDown({
            list: [
                { key: 5, value: 5 },
                { key: 10, value: 10 },
                { key: 25, value: 25 },
                { key: 50, value: 50 },
                { key: 100, value: 100 },
                { key: 250, value: 250 },
                { key: 1000, value: 1000 }
            ],
            key: 'key',
            value: 'value',
            defaultId: setting.pager.size,
            selectitemcallback: function (val) {
                setting.pager.size = val.value;
                TableSetRowVisibility(tab);
            }
        }).appendTo(ddDiv);
        var pagerState = $('<div class="col-sm pagerState">').appendTo(prow);
        //let lastOnPage = (setting.pager.size * setting.pager.currentpageindex + setting.pager.size);
        //if (lastOnPage > visibleDataCount) lastOnPage = visibleDataCount;
        //pagerState.html((setting.pager.size * setting.pager.currentpageindex +1) + '-' + lastOnPage + '/' + visibleDataCount);
        pagerButtonsCell = $('<div class="col-sm">').appendTo(prow);

        pageingFN = function (data) {
            setting.pager.currentpageindex = setting.pager.currentpageindex || 0;
            if (data === 'first')
                setting.pager.currentpageindex = 0;
            if (data === 'prev')
                setting.pager.currentpageindex = setting.pager.currentpageindex > 0 ? setting.pager.currentpageindex - 1 : 0;
            if (data === 'next')
                setting.pager.currentpageindex = setting.pager.currentpageindex >= setting.pager.pageNumber - 1 ? setting.pager.pageNumber - 1 : setting.pager.currentpageindex+1;
            if (data === 'last')
                setting.pager.currentpageindex = setting.pager.pageNumber - 1;

            TableSetRowVisibility(tab);
        };

        CreateButton({
            icon: 'fas fa-angle-double-left',
            onClick: pageingFN,
            clickData: 'first'
        }).appendTo(pagerButtonsCell);
        CreateButton({
            icon: 'fas fa-angle-left',
            onClick: pageingFN,
            clickData: 'prev'
        }).appendTo(pagerButtonsCell);
        CreateButton({
            icon: 'fas fa-angle-right',
            onClick: pageingFN,
            clickData: 'next'
        }).appendTo(pagerButtonsCell);
        CreateButton({
            icon: 'fas fa-angle-double-right',
            onClick: pageingFN,
            clickData: 'last'
        }).appendTo(pagerButtonsCell);
        //pagercell.
    }
    if (setting.footer) {
        let footer = $('<tfoot class="' + headerstyle + '">').appendTo(tab);
        let footercell = $('<td colspan="' + setting.columns.length + '">').appendTo(footer);
        if( isFunction(setting.footer)) {
            let f = setting.footer();
            if (f) {
                f.appendTo(footercell);
            }
        }
        else {
            setting.footer.appendTo(footercell);
        }
    }

    if (setting.additionalHeader) {
        let adhead = $('<tr class="' + headerstyle + '">').prependTo(head);
        let adheadcell = $('<td colspan="' + setting.columns.length + '">').appendTo(adhead);
        if (isFunction(setting.additionalHeader)) {
            let f = setting.additionalHeader();
            if (f) {
                f.appendTo(adheadcell);
            }
        }
        else {
            setting.additionalHeader.appendTo(adheadcell);
        }
    }

    TableSetRowVisibility(tab);
    $('[data-toggle="tooltip"]').tooltip();
    return tab;
}

function TableSetRowVisibility(table) {
    let setting = table.data('setting');
    if (setting.holder) {
        let rows = setting.holder.find('tbody tr');


        let visibleDataCount = 0;
        for (let row of rows) {
            let rindex = $(row).data('rowindex');
            let isHidden = false;

            for (let hidepror in setting.data[rindex].hideData) {
                isHidden = isHidden || setting.data[rindex].hideData[hidepror].hidden;
            }
            $(row).toggle(!isHidden);
            visibleDataCount += !isHidden ? 1 : 0;
        }
        let minShow = 0;
        let maxShow = setting.data.length;
        if (setting.pager) {
            let pageNumber = Math.floor(visibleDataCount / setting.pager.size) + (visibleDataCount % setting.pager.size>0?1:0);
            if (pageNumber * setting.pager.size < visibleDataCount) {
                pageNumber = pageNumber + 1;
            }
            setting.pager.pageNumber = pageNumber;
            if (setting.pager.pageNumber < setting.pager.currentpageindex + 1) {
                setting.pager.currentpageindex = 0;
            }
            let pagerState = $('.pagerState');
            let lastOnPage = setting.pager.size * setting.pager.currentpageindex + setting.pager.size;
            if (lastOnPage > visibleDataCount) lastOnPage = visibleDataCount;
            let firstOnPage = setting.pager.size * setting.pager.currentpageindex + 1;
            pagerState.html(firstOnPage + '-' + lastOnPage + '/' + visibleDataCount);

            visibleDataCount = 0;
            for (let row of rows) {
                let rindex = $(row).data('rowindex');
                let isHidden = false;

                for (let hidepror in setting.data[rindex].hideData) {
                    isHidden = isHidden || setting.data[rindex].hideData[hidepror].hidden;
                }
                visibleDataCount += !isHidden ? 1 : 0;
                isHidden = isHidden || visibleDataCount < firstOnPage || visibleDataCount > lastOnPage;
                $(row).toggle(!isHidden);
                
            }

        }



    }
}
//Tábla függvények
jQuery.fn.extend({
    GetSelectedTableRows: function (callback) {
        let selected = [];
        $(this).find('.chkTableSelection:checked').filter(':visible').each(function () {
            selected.push($(this).parent().data('ID'));
        });
        if (callback) {
            callback(selected);
        }
        return selected;
    },
    GetTableData: function () {

        let setting = $(this).data('setting');
        return setting.data;
    },
    RefreshTable: function () {
        setting = $(this).data('setting');
        setting.itemSelect = false;
        return CreateTable(setting);
    }
});


///id, label, list, selectitemcallback, defaultId
//adatkiolvasás: $(dropdown).data('selected')
function CreateDropDown(setting) {
    setting.id = setting.id || 'cmb' + NewGuid();
    setting.label = setting.label || '';
    var dropDownContainer = $('<div class="drop-down-container" id="' + setting.id + '"></div>');
    var dropdownbtn = $(`<button class="btn btn-primary dropdown-toggle mr-4 w-100 `+ _MDBcolor + `" type="button" data-toggle="dropdown"
  aria-haspopup="true" aria-expanded="false" >`+ setting.label + `</button>`)
        .appendTo(dropDownContainer).data('label', setting.label);
    dropDownContainer.data('selected', { id: null, name: null });
    var items = $('<div class="dropdown-menu">').appendTo(dropDownContainer);


    for (var i = 0; i < setting.list.length; i++) {
        var item = $('<a class="dropdown-item" class="pointer" data-nonavigate="true" >' + setting.list[i][setting.value] + '</a>').appendTo(items);
        item.data('data', setting.list[i]);
        item.on('click', function () {
            let _cont = $(this).parents('.drop-down-container')[0];
            let _lab = $(_cont).find('button').data('label');
            _lab = (_lab.length > 0 ? _lab+ ': ':'') + $(this).data('data')[setting.value];
            $(_cont).find('button').text(_lab);
            dropDownContainer.data('selected', $(this).data('data'));
            if (setting.selectitemcallback) setting.selectitemcallback($(this).data('data'));
        });
        if (setting.list[i][setting.key] === setting.defaultId) {
            item.click();
        }
    }
    return dropDownContainer;
}
//DropWownFüggvények
jQuery.fn.extend({
    SetDropDownKey: function (key) {
        $(this).find("a").each(function () {
            if ($(this).data('data').key === key) {
                $(this).click();
            }
        });
        return this;
    }
});

function CreateSwitch(setting) {
    setting.id = setting.id || 'sw_'+NewGuid();
    setting.text = setting.text || '';
    setting.checked = !!setting.checked;
    const ctrl = $(`<div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="`+ setting.id + `" ` + (setting.checked?'checked':'') +`>
          <label class="custom-control-label" for="`+ setting.id + `">` + setting.text+`</label>
        </div>`);
    if (setting.change) {
        ctrl.find('input').on('change', function () {
            setting.change($(this).is(':checked'));
        }).change();
    }
    return ctrl;
}

function CreateDateRangePicker(setting) {
    setting = setting || {};
    setting.start = setting.start || moment().subtract(6, 'days');//"01/01/2019";
    setting.end = setting.end || moment().subtract(3, 'days');//"12/31/2019";
    // var labelActiveClass = setting.value ? 'class="active"' : '';
    //var picker = $('<div id="div' + setting.id + '" class="md-form ' + setting.class + ' ">' +
    //    '<input class="form-control"  id="' + setting.id + '" readonly" value="' + setting.start + ' - ' + setting.end +'" >' +
        
    //    '</div >');

    const picker = $('<input readonly class="form-control w-100" type="text" name="daterange" value="' + setting.start.format('YYYY/MM/DD') + ' - ' + setting.end.format('YYYY/MM/DD') + '" />');
    picker.daterangepicker({
        showDropdowns: true,
        opens: 'left',
        linkedCalendars: false,
        "applyButtonClasses": "red-gradient",
        "cancelClass": "rgba-red-light",
        "autoApply": true,
        ranges: {
            'Ma': [moment(), moment()],
            'Tegnap': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Elmúlt 7 nap': [moment().subtract(6, 'days'), moment()],
            'Elmúlt 30 nap': [moment().subtract(29, 'days'), moment()],
            'Ez a hónap': [moment().startOf('month'), moment().endOf('month')],
            'Előző hónap': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Előző hónap mai napig': [moment().subtract(1, 'month').startOf('month'), moment()]
        },
        "locale": {
            "format": "YYYY/MM/DD",
            "separator": " - ",
            "applyLabel": "Kiválaszt",
            "cancelLabel": "Bezár",
            "fromLabel": "-tól",
            "toLabel": "-ig",
            "customRangeLabel": "Egyedi időszak",
            "weekLabel": "W",
            "daysOfWeek": [
                "V",
                "H",
                "K",
                "Sze",
                "Cs",
                "P",
                "Szo"
            ],
            "monthNames": [
                "Január",
                "Február",
                "Március",
                "Április",
                "Május",
                "Június",
                "Július",
                "Augusztus",
                "Szeptember",
                "Október",
                "November",
                "December"
            ],
            "firstDay": 1
        }
    }, function (start, end, label) {
        if (setting.onSelect) {
            setting.onSelect(start, end, label);
        }
        //console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));

    });
    return picker;

}

function ShowConfirm(message, headermsg, CallbackOK, CallbackCancel, callbackObject) {
    var content = $("<div>").html(message);

    var footer = $('<div>');
    CreateButton({
        text: "Ok",
        onClick: function ()
        {
            if (CallbackOK) {
                CallbackOK(callbackObject);
            }
            // mainClass.HideModal(confirmDialog);
        }
    }).appendTo(footer);
    CreateButton({
        text: "Mégsem",
        onClick: function ()
        {
            if (CallbackCancel) {
                CallbackCancel(callbackObject);
            }
            // mainClass.HideModal(confirmDialog);
        },
        icon: 'fas fa-ban', color: _MDBcolorSec
    }).appendTo(footer);
    confirmDialog = CreateDialog({ header: headermsg, content: content, size: 'modal-sm', footer: footer });
    mainClass.ShowModal(confirmDialog);
    return confirmDialog;
}
function HideConfirm() {
    mainClass.HideModal(confirmDialog);
}

function ShowError(message, header) {
    ShowInfo(message, header, true);
}

function ShowInfo(message, header, isError, okCallBack, size) {
    isError = !!isError;
    header = header || (isError ? 'Hiba' : 'Info');
    size = size || 'sm';

    var content = $("<div" + (isError? " class='red-text'":"")+">").html(message);

    let diaid = 'infodialog' + NewGuid();

    var footer = $('<div>');
    CreateButton({
        text: "Ok",
        onClick: function () {
            mainClass.HideModal($("#"+diaid), okCallBack);
        }
    }).appendTo(footer);

    const cd = CreateDialog({ dialogid: diaid , header: header, content: content, size: 'modal-' + size, footer: footer });
    mainClass.ShowModal(cd);
}

function ShowToast(message, header, delay) {
    delay = delay || 5000;
    header = header || '';
    const t = $(`<div role="alert" aria-live="assertive" aria-atomic="true" class="toast w-300px" data-autohide="true" data-delay="` + delay + `">
  <div class="toast-header red-gradient">

    <strong class="mr-auto">`+ header+`</strong>
    <small></small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    `+ message +`
  </div>
</div>`).appendTo(".toast-container");
    t.toast('show');
    setTimeout(() => {
        t.remove();
    }, delay);
}

function CreateGrid(rows, cols, id, size) {
    size = size || 'sm';
    idString = id ? "id=" + id : '';
    let grid = $('<div ' + idString + '>');
    if ($.isNumeric(rows) && $.isNumeric(cols)) {

        for (var r = 0; r < rows; r++) {
            const row = $('<div class="row">').appendTo(grid);
            for (var c = 0; c < cols; c++) {
                const col = $('<div class="column col-'+size+'">').appendTo(row);
            }
        }
    }
    return grid;
}

jQuery.fn.extend({
    AddToGrid: function (grid, row, col) {
        col = col || 0;
        $($($(grid).children('.row')[row]).children('.column')[col]).append(this);
        return $(this);
    },
    GetCellValue: function (row, col) {
        return $($($(this).children('.row')[row]).children('.column')[col]);
    },
    SetCellValue: function (value, row, col) {
        $($($(this).children('.row')[row]).children('.column')[col]).html(value);
        return $(this);
    }
});

function CreateSlider(setting) {
    if (typeof (setting) === 'function') {
        setting = setting();
    }
    setting.id = setting.id || 'slider' + NewGuid();
    setting.min = setting.min || 0;
    setting.max = setting.max || setting.min + 1;
    setting.step = setting.step || 1;
    setting.value = setting.value || setting.min;
    setting.valuePrefix = setting.valuePrefix || '';
    setting.valuePostfix = setting.valuePostfix || '';
    let div = $('<div>');
    if (setting.label) {
        $('<label for="' + setting.id + '">' + setting.label + ' ' + setting.valuePrefix + '<div class="d-inline rangevalueholder">' + setting.value + '</div> ' + setting.valuePostfix+ '</label>').appendTo(div);
    }
    var inp = $('<input type="range" class="custom-range" min="' + setting.min + '" max="' + setting.max + '" step="' + setting.step + '" id="' + setting.id + '" value="' + setting.value + '">').appendTo(div);

    inp.on('input',function () {
        $(this).parent().find('.rangevalueholder').html($(this).val());
    })
    if (setting.onChange) {
        inp.change(function () {
            setting.onChange($(this).val());
        });
    }
    return div;
}