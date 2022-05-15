package org.kaznalnrprograms.Accounting.Jasper;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import net.sf.jasperreports.export.*;
import org.kaznalnrprograms.Accounting.Jasper.Models.RepParams;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Класс для генерации отченов .jrxml-файлов
 */
 public class Report {
    static java.sql.Connection pgCon=null;
    static JasperPrint jasperPrint=null;
    static String lastRepName="";
    static String lastDateWork="";
    /**
     * Конструктор
     * @param jdbcName - имя jdbc-драйвера:  new Report("jdbc/Accounting"); //(<Resource name="jdbc/Accounting")
     * @throws IOException
     * @throws SAXException
     * @throws ParserConfigurationException
     */
    public Report(String jdbcName) throws IOException, SAXException, ParserConfigurationException, SQLException {

        HashMap<String, String> connectParam=getConnect(jdbcName);
        Properties properties = new Properties();                     // Определение свойств подключения Connection
        properties.setProperty("password"         , connectParam.get("password"));
        properties.setProperty("user"             , connectParam.get("user"));


        if(! new SimpleDateFormat("dd.MM.yyyy").format(new Date()).equals(lastDateWork)) {  // Удаление временных файлов 1 раз в рабочий день
             deletTmpFiles();
            lastDateWork=new SimpleDateFormat("dd.MM.yyyy").format(new Date());
        }

        if(pgCon==null) {

            for (int i = 0; i < 1; i++) {
                try {
                    pgCon = DriverManager.getConnection(connectParam.get("url"), properties);   // Пробуем соединиться (с первого раза не соединянтся)
                    if (pgCon != null)
                        break;
                } catch (SQLException e) {;}                                                     // С первого раза не соединилось, пробуем еще раз
                if (pgCon == null) {
                    try {
                        pgCon = DriverManager.getConnection(connectParam.get("url"), properties); // Пробуем последний раз, если не соединиться - выдаем ошибку
                    } catch (SQLException e) {
                        throw e;
                    }
                }
            }
        }
    }

    /**
     * Метод строит отчет и возвращает его в виде строки
     * @param jrXMLName  - имя файла.jrxml (без расширения)
     * @param parameters - объект, содержащий параметры
     * @return
     */
    public String getHTML(String jrXMLName, Map parameters) throws IOException, JRException {
        JasperDesign jasperDesign;
        JasperReport jasperReport;

        //String jrXMLNameWithPath="..\\rep\\" + jrXMLName+new SimpleDateFormat("hhmmssSSS").format(new Date());
        String jrXMLNameWithPath=getPathToTomcat()+"webapps/rep/" + jrXMLName+new SimpleDateFormat("hhmmssSSS").format(new Date());

        try {
            //jasperDesign = JRXmlLoader.load("..\\rep\\"+jrXMLName+".jrxml");
            jasperDesign = JRXmlLoader.load(getPathToTomcat()+"webapps/rep/"+jrXMLName+".jrxml");
            jasperReport = JasperCompileManager.compileReport(jasperDesign);

            jasperPrint  = JasperFillManager.fillReport(jasperReport, parameters, pgCon);
            JasperExportManager.exportReportToHtmlFile(jasperPrint,jrXMLNameWithPath+".html");

            String contents = new String(Files.readAllBytes(Paths.get(jrXMLNameWithPath+".html")),  "UTF-8");

            File file = new File(jrXMLNameWithPath+".html");
            file.delete();
            lastRepName=jrXMLName;
            return contents;
        } catch (JRException | IOException e) {
            if(e.getClass().getName()=="net.sf.jasperreports.engine.JRException"){
                throw new JRException(e.getMessage()+" "+((JRException) e).getCause());
            }
            throw e;
        }
    }

    /**
     * Метод формирует pdf файл на основе ранее построенного отчета
     * @param repParams
     * @return
     * @throws IOException
     * @throws JRException
     */
    public String createPDF(RepParams repParams) throws IOException, JRException {
        String repName=repParams.getJrxml();
        String postFix=repParams.getPostFix();
        //repName="jrOSV";
        if(repName.length()==0 || !repName.equals(lastRepName)){
            JRException e=new JRException("Отчет "+repName+" не сформирован.<br>Нажмите кнопку 'Обновить и сформируйте отчет'");
            throw e;
        }

        JRPdfExporter exporter = new JRPdfExporter();
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(getPathToTomcat()+"webapps/pdf/"+repName+postFix+".pdf"));
        SimplePdfExporterConfiguration configuration = new SimplePdfExporterConfiguration();
        exporter.setConfiguration(configuration);
        exporter.exportReport();
        return getPathToTomcat()+"pdf/"+repName+postFix+".pdf";
    }
    /**
     * Метод формирует excel файл на основе ранее построенного отчета
     * @param repParams
     */
    public String createExcel(RepParams repParams) throws IOException, JRException {
        String repName=repParams.getJrxml();
        String postFix=repParams.getPostFix();
        if(repName.length()==0 || !repName.equals(lastRepName)){
            JRException e=new JRException("Отчет "+repName+" не сформирован.<br>Нажмите кнопку 'Обновить и сформируйте отчет'");
            throw e;
        }

        JRXlsExporter xlsExporter = new JRXlsExporter();
        xlsExporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        xlsExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(getPathToTomcat()+"webapps/pdf/"+repName+postFix+".xls"));
        SimpleXlsReportConfiguration xlsReportConfiguration = new SimpleXlsReportConfiguration();
        SimpleXlsExporterConfiguration xlsExporterConfiguration = new SimpleXlsExporterConfiguration();
        xlsReportConfiguration.setOnePagePerSheet(false); // true -разделение на листы в Excel, false - всё на одном листе
        xlsReportConfiguration.setRemoveEmptySpaceBetweenRows(false); // true - убрать проблемы между листами при экспорте одним листом
        xlsReportConfiguration.setDetectCellType(true);
        xlsReportConfiguration.setWhitePageBackground(false);
        xlsExporter.setConfiguration(xlsReportConfiguration);
        xlsExporter.exportReport();

        return getPathToTomcat()+"pdf/"+repName+postFix+".xls";
    }
    /**
     * Метод формирует word файл на основе ранее построенного отчета
     * @param repParams
     */
    public String createWord(RepParams repParams) throws IOException, JRException {
        String repName=repParams.getJrxml();
        String postFix=repParams.getPostFix();
        if(repName.length()==0 || !repName.equals(lastRepName)){
            JRException e=new JRException("Отчет "+repName+" не сформирован.<br>Нажмите кнопку 'Обновить и сформируйте отчет'");
            throw e;
        }

        JRDocxExporter exporter = new JRDocxExporter();
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        File exportReportFile = new File(getPathToTomcat()+"webapps/pdf/"+repName+postFix + ".docx");
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(exportReportFile));
        exporter.exportReport();

        return getPathToTomcat()+"pdf/"+repName+postFix+".docx";
    }

    /**
     * Удаляет pdf файл
     * @param pdfFile
     */
    public void deleteFile(String pdfFile) throws IOException {
        File file = new File(getPathToTomcat()+"webapps/pdf/"+pdfFile+".pdf");
        if (file.exists()) {
            file.delete();
        }
    }

        /**
         * Метод определят из файла server.xml параметры соединения с базой данных (url, username, password)
         * @param jdbcName -  имя jdbc-драйвера  (<Resource name="jdbc/Accounting")
         * @return возвращает объект тип Map
         * @throws ParserConfigurationException
         * @throws IOException
         * @throws SAXException
         */
    private HashMap<String, String> getConnect(String jdbcName) throws ParserConfigurationException, IOException, SAXException {
        HashMap<String, String> connectParam = new HashMap<>();
        String pathServer_xml=getPathToTomcat()+"conf/server.xml";

        DocumentBuilder documentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
        Document document = documentBuilder.parse(pathServer_xml);
        Node root = document.getDocumentElement();
        NodeList nodes = root.getChildNodes();
        for (int i = 0; i < nodes.getLength(); i++) {
            Node node = nodes.item(i);
            if(node.getNodeName()=="GlobalNamingResources"){
                NodeList subNodes = node.getChildNodes();
                for (int j = 0; j < nodes.getLength(); j++) {
                    Node subNode = subNodes.item(j);
                    if(subNode.getNodeName()=="Resource"){
                        for (int k = 0; k < subNode.getAttributes().getLength(); k++){
                            if(subNode.getAttributes().item(k).getNodeName()=="name"){
                                String value=subNode.getAttributes().item(k).getNodeValue();
                                if(value.equals(jdbcName)){
                                    for (int l = 0; l < subNode.getAttributes().getLength(); l++){
                                        if(subNode.getAttributes().item(l).getNodeName().equals("url"))
                                            connectParam.put("url",      subNode.getAttributes().item(l).getNodeValue());
                                        if(subNode.getAttributes().item(l).getNodeName().equals("password"))
                                            connectParam.put("password", subNode.getAttributes().item(l).getNodeValue());
                                        if(subNode.getAttributes().item(l).getNodeName().equals("username"))
                                            connectParam.put("user",     subNode.getAttributes().item(l).getNodeValue());
                                    }
                                    return connectParam;
                                }
                            }
                        }
                    }
                }
            }
        }
        return connectParam;
    }

    /**
     * Возвращает путь к корневой папке сервера "C:\Program Files\Apache Software Foundation\Tomcat 9.0"\
     * @return   "../" - режим отладки,  "" - рабочий режим
     */
    private String getPathToTomcat() {
        String pathServer_xml = "";
        File server_xml = new File(pathServer_xml + "conf/server.xml");
        if (!server_xml.exists()) {
            pathServer_xml = "../";   // "..\\conf\\server.xml"
        }
        return pathServer_xml;
    }

    /**
     * Удаляет временные файлы
      */
    private void deletTmpFiles(){
        File[] children = new File(getPathToTomcat()+"temp/").listFiles();  // удаление из папки temp
        if(children!=null) {
            int length = children.length;
            for (int i = 0; i < children.length; i++) {
                String curName = children[i].getName();
                if (curName.length() > 8 && curName.substring(0, 7).toLowerCase().equals("jr-font")                              //  начинается на "jr-font"
                ) {
                    try { new File(children[i].getPath()).delete(); } catch (Exception ex) {  ; }
                }
            }
        }


        children = new File(getPathToTomcat()+"webapps/pdf/").listFiles();  // удаление из папки /webapps/pdf
        if(children!=null) {
            int length = children.length;
            for (int i = 0; i < children.length; i++) {
                try{ new File(children[i].getPath()).delete(); } catch (Exception ex) {;}     // удаляем все подряд
            }
        }

    }
 }
