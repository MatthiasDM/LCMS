package gcms.qcmanager;

///*
// * To change this license header, choose License Headers in Project Properties.
// * To change this template file, choose Tools | Templates
// * and open the template in the editor.
// */
//package gcms.lis.lcms.other.qcmanager;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import java.io.IOException;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import static mdmconnectionmanager.MdmDatabaseManager.getDataBaseData;
//import static mdmconnectionmanager.MdmDatabaseManager.updateDatabaseData;
//
//import static mdmcore.MdmCore.getCoreFileUrl;
//import static mdmcore.MdmCore.*;
//
///**
// *
// * @author matmey
// */
//public class SqliteManager {
//
//    public static String getLotTable() throws IOException, ClassNotFoundException {
//        String result = null;
//        String sql = "SELECT * FROM Controls";
//        String databasefile = getCoreFileUrl("database_mdmbioradqc");
//        List<HashMap> results = getDataBaseData(sql, new String[]{"id", "name", "level", "bioradlotid", "valid", "comment", "toestel", "startdatum", "einddatum"}, databasefile);
//        ObjectMapper mapper = new ObjectMapper();
//        result = (mapper.writeValueAsString(results));
//        return result;
//    }
//
//    public static String getTestTable() throws IOException, ClassNotFoundException {
//        String result = null;
//        String sql = "SELECT * FROM Tests";
//        String databasefile = getCoreFileUrl("database_mdmbioradqc");
//        List<HashMap> results = getDataBaseData(sql, new String[]{"id", "testid", "test", "instrument", "bioradanalyteid", "bioradinstrument"}, databasefile);
//        ObjectMapper mapper = new ObjectMapper();
//        result = (mapper.writeValueAsString(results));
//        return result;
//    }
//
//    public static String getData(String sql, String[] fields) throws IOException, ClassNotFoundException {
//        String result = null;
//        String databasefile = getCoreFileUrl("database_mdmbioradqc");
//        List<HashMap> results = getDataBaseData(sql, fields, databasefile);
//        ObjectMapper mapper = new ObjectMapper();
//        result = (mapper.writeValueAsString(results));
//        return result;
//    }
//
//    public static void changeLotInfo(Map<String, String[]> record) throws IOException, ClassNotFoundException {
//        String sql1 = "UPDATE Controls SET ";
//        String sql3 = "WHERE id = " + record.get("id")[0];
//        String sql2 = "";
//        record.remove("id");
//
//        for (Map.Entry<String, String[]> entry : record.entrySet()) {
//            sql2 += "`" + entry.getKey() + "` = '" + entry.getValue()[0] + "' ,";
//
//        }
//        sql2 = sql2.substring(0, sql2.length() - 1);
//
//        String sql = sql1 + sql2 + sql3;
//        String databasefile = getCoreFileUrl("database_mdmbioradqc");
//        updateDatabaseData(sql, databasefile);
//    }
//
//    public static void addLotInfo(Map<String, String[]> record) throws IOException, ClassNotFoundException {
//        String sql1 = "INSERT INTO Controls";
//        String sql2 = "(";
//        record.remove("id");
//
//        for (Map.Entry<String, String[]> entry : record.entrySet()) {
//            sql2 += entry.getKey() + ",";
//
//        }
//        sql2 = sql2.substring(0, sql2.length() - 1);
//        sql2 += ") VALUES (";
//
//        for (Map.Entry<String, String[]> entry : record.entrySet()) {
//            sql2 += "'" + entry.getValue()[0] + "' ,";
//
//        }
//        sql2 = sql2.substring(0, sql2.length() - 1);
//
//        String sql = sql1 + sql2 + ")";
//        String databasefile = getCoreFileUrl("database_mdmbioradqc");
//        updateDatabaseData(sql, databasefile);
//
//    }
//
//    public static void changeTestInfo(Map<String, String[]> record) throws IOException, ClassNotFoundException {
//        String sql1 = "UPDATE Tests SET ";
//        String sql3 = "WHERE id = " + record.get("id")[0];
//        String sql2 = "";
//        record.remove("id");
//
//        for (Map.Entry<String, String[]> entry : record.entrySet()) {
//            sql2 += "`" + entry.getKey() + "` = '" + entry.getValue()[0] + "' ,";
//
//        }
//        sql2 = sql2.substring(0, sql2.length() - 1);
//
//        String sql = sql1 + sql2 + sql3;
//        String databasefile = getCoreFileUrl("database_mdmbioradqc");
//        updateDatabaseData(sql, databasefile);
//    }
//
//    public static void addTestInfo(Map<String, String[]> record) throws IOException, ClassNotFoundException {
//        String sql1 = "INSERT INTO Tests";
//        String sql2 = "(";
//        record.remove("id");
//
//        for (Map.Entry<String, String[]> entry : record.entrySet()) {
//            sql2 += entry.getKey() + ",";
//
//        }
//        sql2 = sql2.substring(0, sql2.length() - 1);
//        sql2 += ") VALUES (";
//
//        for (Map.Entry<String, String[]> entry : record.entrySet()) {
//            sql2 += "'" + entry.getValue()[0] + "' ,";
//
//        }
//        sql2 = sql2.substring(0, sql2.length() - 1);
//
//        String sql = sql1 + sql2 + ")";
//        String databasefile = getCoreFileUrl("database_mdmbioradqc");
//        updateDatabaseData(sql, databasefile);
//
//    }
//
//}
