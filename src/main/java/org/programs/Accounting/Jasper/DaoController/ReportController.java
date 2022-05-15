package org.kaznalnrprograms.Accounting.Jasper.DaoController;

import org.kaznalnrprograms.Accounting.Jasper.DaoController.IReportDao;
import org.kaznalnrprograms.Accounting.Jasper.Models.RepParams;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ReportController {
    private IReportDao dReport;
    public ReportController(IReportDao dReport) {        this.dReport = dReport;    }

    @GetMapping("/Jasper/Jasper")
    @PreAuthorize("GetActRight('JasperView.dll','JasperViewView')")
    public String JasperView(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "Jasper/Jasper :: Jasper";
    }

    @PostMapping("/Jasper/Report")
    @PreAuthorize("GetActRight('JasperView.dll','JasperViewView')")
    public @ResponseBody  String Report(@RequestBody RepParams repParams) throws Exception {
        return dReport.Report(repParams);
    }

    /**
     *  Создает pdf файл по последнему созданному отчету
     * @param repParams
     */
    @PostMapping("/Jasper/createPDF")
    @PreAuthorize("GetActRight('JasperView.dll','JasperViewView')")
    public @ResponseBody  String createPDF(@RequestBody RepParams repParams) throws Exception {
        return dReport.createPDF(repParams);
    }

    /**
     *  Удаляет pdf файл (если он существует)
     */
    @PostMapping("/Jasper/deletePDF")
    @PreAuthorize("GetActRight('JasperView.dll','JasperViewView')")
    public @ResponseBody  String deletePDF(@RequestBody RepParams repParams) throws Exception {
        dReport.deletePDF(repParams.getPostFix());
        return "";
    }
    /**
     *  Создает excel- файл на основе ранее созданного отчета, возвращает путь к нему
     */
    @PostMapping("/Jasper/createExcel")
    @PreAuthorize("GetActRight('JasperView.dll','JasperViewView')")
    public @ResponseBody  String createExcel(@RequestBody RepParams repParams) throws Exception {
        String r = dReport.createExcel(repParams);
        return r;
    }

    /**
     *  Создает word- файл на основе ранее созданного отчета, возвращает путь к нему
     */
    @PostMapping("/Jasper/createWord")
    @PreAuthorize("GetActRight('JasperView.dll','JasperViewView')")
    public @ResponseBody  String createWord(@RequestBody RepParams repParams) throws Exception {
        String r = dReport.createWord(repParams);
        return r;
    }




}