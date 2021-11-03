/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.database;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.HashMap;
import java.util.List;
import org.bson.Document;

/**
 *
 * @author Matthias
 */
public class GetResponse {
    
    Integer page;
    List<Document> rows;
    Integer records;
    Integer total;

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

  

    public Integer getRecords() {
        return records;
    }

    public void setRecords(Integer records) {
        this.records = records;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public GetResponse() {
    }

    public List<Document> getRows() {
        return rows;
    }

    public void setRows(List<Document> rows) {
        this.rows = rows;
    }

    public GetResponse(Integer page, List<Document> rows, Integer records, Integer total) {
        this.page = page;
        this.rows = rows;
        this.records = records;
        this.total = total;
    }



   



  

 
    
    
}
