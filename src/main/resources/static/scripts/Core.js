contextPath = ""
function LoadForm(Id, url, FormInitFunc) {
    $.ajax({
        method:"GET",
        url: url,
        success: function(data){
            $(Id).html(data);
            InitEasyUIForBlock(Id);
            if(FormInitFunc!=null)
            {
                FormInitFunc();
            }
        },
        error: (data)=>{
            let responseJSON = data.responseJSON;
            let error = "message: " + responseJSON.message + "<br/>"
                +"error: " + responseJSON.error + "<br/>"
                +"status: " + responseJSON.status + "<br/>"
                +"path: " + responseJSON.path;
            $.messager.alert('Ошибка',error,'error');
        }
    });
}
function InitEasyUIForBlock(Id) {
    $.parser.parse(Id);
}
function EscapeSpecialHTMLCharacters(data) {
    let l_data = data;
    l_data = JSON.stringify(l_data);
    l_data = l_data.replace(/</g,"&lt;").replace(/>/g,"&gt;");;
    return JSON.parse(l_data);
}
function StartNestedModulGlobal(Id, AppCode, Param) {
    import(contextPath + "/Modules/"+AppCode+"/"+AppCode+".js").then(
        module => module.StartNestedModul(Id, Param),
        (error) => { $.messager.alert('Ошибка',"Не удалось загрузить модуль с по пути /Modules/"+AppCode+"/"+AppCode+".js"+"<br/>"+error,'error'); }
    );
}
function StartModalModulGlobal(AppCode, StartParams, ResultFunc) {
    import(contextPath + "/Modules/"+AppCode+"/"+AppCode+".js").then(
        module => module.StartModalModul(StartParams, ResultFunc),
        (error) => { $.messager.alert('Ошибка',"Не удалось загрузить модуль с по пути /Modules/"+AppCode+"/"+AppCode+".js"+"<br/>"+error,'error'); }
    );
}
//Добаление навигации с клавиатуры для DataGrid - а
function AddKeyboardNavigationForGrid(grid) {
    grid.datagrid('getPanel').panel('panel').attr('tabindex',1).bind('keydown',function(e){
        switch(e.keyCode){
            case 38:	// up
                var selected = grid.datagrid('getSelected');
                if (selected){
                    let index = grid.datagrid('getRowIndex', selected);
                    grid.datagrid('selectRow', index-1);
                } else {
                    grid.datagrid('selectRow', 0);
                }
                break;
            case 40:	// down
                var selected = grid.datagrid('getSelected');
                if (selected){
                    let index = grid.datagrid('getRowIndex', selected);
                    grid.datagrid('selectRow', index+1);
                } else {
                    grid.datagrid('selectRow', 0);
                }
                break;
        }
    });
}
//Создание диалогового окна для модального вызова справочника
function CreateModalWindow(Id, title){
    let el = document.createElement('div');
    el.setAttribute("id", Id);
    document.body.appendChild(el);
    $("#"+Id).window({
        id:Id,
        width:"1024",
        height:"633",
        modal: true,
        title: title,
        minimizable: false,
        collapsible: false,
        onClose:()=>{ $("#"+id).window("destroy");}
    });
}