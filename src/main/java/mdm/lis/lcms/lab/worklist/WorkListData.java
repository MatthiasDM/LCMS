/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.lab.worklist;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import mdm.GsonObjects.Lab.WorklistSummary;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

/**
 *
 * @author Matthias
 */
public class WorkListData {
    public static final String filePath = "‪Z:\\mdmTools\\werklijstsamenvatter.txt";
    public static final String fileOutputPath = "D:\\Backup\\Kwaliteitssysteem\\mdmTools\\Werklijstsamenvatter\\data.js";
    private static final Logger LOG = Logger.getLogger(WorkListData.class.getName());

    public WorkListData() {
    }
    
        
       public static List<WorklistSummary> generationSummaryObjects() throws FileNotFoundException, IOException, URISyntaxException {
        List<WorklistSummary> summary = new ArrayList<>();

        Reader csvReader = new FileReader("C:\\Users\\Matthias\\Documents\\werklijstsamenvatter.txt");
        CSVParser csvParser = new CSVParser(csvReader, CSVFormat.DEFAULT);
        for (CSVRecord csvRecord : csvParser.getRecords()) {
            try {
                summary.add(new WorklistSummary(csvRecord.get(0), csvRecord.get(1), csvRecord.get(2), csvRecord.get(3), csvRecord.get(4)));
            } catch (Exception e) {
                LOG.log(Level.INFO, "Cannot parse: " + csvRecord.toString());
            }
        }
        return summary;
    }
}
