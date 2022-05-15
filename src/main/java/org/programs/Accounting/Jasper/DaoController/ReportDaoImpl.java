package org.kaznalnrprograms.Accounting.Jasper.DaoController;

import net.sf.jasperreports.engine.JRException;
import org.kaznalnrprograms.Accounting.Jasper.Report;
import org.kaznalnrprograms.Accounting.Jasper.Models.RepBean;
import org.kaznalnrprograms.Accounting.Jasper.Models.RepParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Repository
public class ReportDaoImpl implements IReportDao {
    @Value("${JndiName}")
    private String jndiName;


    @Override
    public String Report(RepParams repParams) throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException {
        String jdbcName=jndiName.substring(15);

        Report report = new Report(jdbcName);

        Map parameters = new HashMap();
        try {
            for (int i = 0; i < repParams.getParams().length; i++) {
                switch (repParams.getParams()[i].getType().toLowerCase()) {
                    case ("int"):
                        parameters.put(repParams.getParams()[i].getName(), repParams.getParams()[i].getVal(0));
                        break;
                    case ("string"):
                        parameters.put(repParams.getParams()[i].getName(), repParams.getParams()[i].getVal(""));
                        break;
                    case ("date"):
                        parameters.put(repParams.getParams()[i].getName(), repParams.getParams()[i].getVal(new Date()));
                        break;
                    case ("double"):
                        parameters.put(repParams.getParams()[i].getName(), repParams.getParams()[i].getVal(0.1));
                        break;
                }
            }
            String rep = "<!--"+repParams.getJrxml()+"-->"+report.getHTML(repParams.getJrxml(), parameters);
            return rep;
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Формирует PDF файл и возвращает его имя
     * @param repParams
     */
    @Override
    public String createPDF(RepParams repParams) throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException {
        Report report = new Report(getDataSourceName());   //"jdbc/Accounting"
        String r=report.createPDF(repParams);

        return r;
    }

    /**
     *  Удаляет pdfFile
     * @param pdfFile
     */
    @Override
    public void   deletePDF(String pdfFile)     throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException {
        Report report = new Report(getDataSourceName());    //"jdbc/Accounting"
        report.deleteFile(pdfFile);
    }


    /**
     *  Формирует excel файл
     */
    @Override
    public String createExcel(RepParams repParams)     throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException {
        Report report = new Report(getDataSourceName());     //"jdbc/Accounting"
        String r=report.createExcel(repParams);
        return r;
    }
    /**
     *  Формирует word файл
     */
    @Override
    public String createWord(RepParams repParams)     throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException {
        Report report = new Report(getDataSourceName());   //"jdbc/Accounting"
        String r=report.createWord(repParams);
        return r;
    }

    /**
     * Возвращает  имя источника данных
     * @return
     */
    private String getDataSourceName()    {
        String r=jndiName.substring(15);
        return r;
    }

}
