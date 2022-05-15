package org.kaznalnrprograms.Accounting.MainApp.Controllers;

import org.kaznalnrprograms.Accounting.MainApp.Interfaces.IAppsDao;
import org.kaznalnrprograms.Accounting.MainApp.Models.AppAttributes;
import org.kaznalnrprograms.Accounting.MainApp.Models.AppModel;
import org.kaznalnrprograms.Accounting.MainApp.Models.TreeNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class MainAppController {
    @Autowired
    private IAppsDao dApps;

    @GetMapping("/MainApp")
    public String MainApp()  {
        return "MainApp/MainApp";
    }
    @GetMapping("/MainApp/MainFragment")
    public String MainFragment()
    {
        return "MainApp/MainAppFragments :: MainFragment";
    }
    private List<TreeNode> convertAppModelToTreeMenu(List<AppModel> apps)
    {
        List<TreeNode> nodes = new ArrayList<>();
        for (AppModel app: apps) {
            AppAttributes appAttr = new AppAttributes();
            appAttr.setCode(app.getCode());
            appAttr.setReport(app.getReport());

            TreeNode node = new TreeNode();
            node.setId(app.getId().toString() + "_" + app.getCodedll());
            node.setText(app.getName());
            node.setIconCls(app.getReport()==0?"icon-folder":"");
            node.setAttributes(appAttr);
            List<TreeNode> ChildApps = convertAppModelToTreeMenu((List<AppModel>) app.getApps());
            node.setChildren(ChildApps);
            nodes.add(node);
        }
        return nodes;
    }
    @GetMapping("/MainApp/AppsList")
    public @ResponseBody List<TreeNode> getAppsList() throws Exception {
        List<AppModel> apps = dApps.getApps();
        List<TreeNode> nodes =  convertAppModelToTreeMenu(apps);
        return nodes;
    }
    @GetMapping("/")
    public ModelAndView Index(){
        return new ModelAndView("redirect:/MainApp");
    }
}
