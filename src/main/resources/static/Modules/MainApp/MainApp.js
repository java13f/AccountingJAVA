class MainForm {
    constructor(isAuthenticated) {
        this.isAuthenticated = isAuthenticated;
    }

    Start()
    {
        LoadForm("#app", this.GetUrl("/MainApp/MainFragment/"), this.InitFunc.bind(this));
    }
    GetUrl(url)
    {
        return contextPath + url;
    }
    InitFunc()
    {
        if(this.isAuthenticated){
            this.filter = new LibFilter("MainApp");
            this.tvTasks = $("#tvTasks_MainApp");
            this.tbTasks = $("#tbTasks_MainAPP");
            this.filter.LoadFilter(function(){
                this.tvTasks.tree({
                    url: this.GetUrl("/MainApp/AppsList/"),
                    onDblClick: this.TaskTreeDblClick.bind(this),
                    onLoadError: (data)=>{ this.ShowErrorResponse(data.responseJSON); },
                    onExpand: this.tvTasksExpand.bind(this),
                    onCollapse: this.tvTasksCollapse.bind(this),
                    onLoadSuccess: this.tvTasks_onLoadSuccess.bind(this)
                });
            }.bind(this));
        }
    }

    /**
     * Обработка разворачивание дерева
     * @param node узел депева
     */
    tvTasksExpand(node){
        let tasks = JSON.parse(this.filter.GetValue("ExpandTasks", "{}"));
        tasks[node.id] = node.id;
        this.filter.SetValue("ExpandTasks", JSON.stringify(tasks))
        this.filter.SaveFilter();
    }
    /**
     * Обработка сворачивания дерева
     * @param node узел депева
     */
    tvTasksCollapse(node){
        let tasks = JSON.parse(this.filter.GetValue("ExpandTasks", "{}"));
        if(node.id in tasks){
            delete tasks[node.id];
        }
        this.filter.SetValue("ExpandTasks", JSON.stringify(tasks))
        this.filter.SaveFilter();
    }
    TaskTreeDblClick(node)
    {
        if(node.attributes.report==3){ return; }
        if(node.children.length > 0) {return;}
        let AppCode = node.attributes.code;
        let tab = this.tbTasks.find("#MainApp_TaskTab_"+AppCode);

        if(tab.length!=0)
        {
            let index = this.tbTasks.tabs('getTabIndex',tab);
            this.tbTasks.tabs("select", index);
        }
        else
        {
            let Param="";
            if(node.attributes.report==2){
                Param=AppCode;
                this.tbTasks.tabs("add", {id: "MainApp_TaskTab_" + AppCode, title: node.text, selected: true, closable: true  });
                StartNestedModulGlobal("MainApp_TaskTab_" + AppCode, "Jasper", Param);
            }
            else {
                this.tbTasks.tabs("add", {id: "MainApp_TaskTab_" + AppCode, title: node.text, selected: true, closable: true  });
                StartNestedModulGlobal("MainApp_TaskTab_" + AppCode, AppCode, Param);
            }
        }
    }
    ShowErrorResponse(responseJSON) {
        let error = "message: " + responseJSON.message + "<br/>"
        +"error: " + responseJSON.error + "<br/>"
        +"status: " + responseJSON.status + "<br/>"
        +"path: " + responseJSON.path;
        this.ShowError(error);
    }
    ShowError(text) {
        $.messager.alert("Ошибка", text, "error");
    }

    /**
     * Обработка успешной загрузки дерева задач
     * @param node
     * @param data
     */
    tvTasks_onLoadSuccess(node, data){
        this.tvTasks.tree({ animate: false, url: "", onExpand: function(node){}, onCollapse: function(node){}});
        this.tvTasks.tree("collapseAll");
        let tasks = JSON.parse(this.filter.GetValue("ExpandTasks", "{}"));
        for(let key in tasks) {
            var node = this.tvTasks.tree('find', key);
            this.tvTasks.tree("expand", node.target);
        }
        this.tvTasks.tree({
            animate: true,
            url: "",
            onExpand: this.tvTasksExpand.bind(this),
            onCollapse: this.tvTasksCollapse.bind(this),
        });
    }
}
export function StartApp(isAuthenticated) {
    let form = new MainForm(isAuthenticated);
    form.Start();
}