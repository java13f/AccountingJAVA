package org.kaznalnrprograms.Accounting.Jasper.DaoController;

import net.sf.jasperreports.engine.JRException;
import org.kaznalnrprograms.Accounting.Jasper.Models.RepParams;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;

public interface IReportDao {
    String Report(RepParams repParams) throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException;
    String createPDF(RepParams repParams) throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException;
    void   deletePDF(String pdfFile)     throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException;
    String createExcel(RepParams repParams)     throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException;
    String createWord(RepParams repParams)     throws ParserConfigurationException, SAXException, IOException, ParseException, JRException, SQLException;
}
