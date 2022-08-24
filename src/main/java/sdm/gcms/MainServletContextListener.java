/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms;

import jakarta.servlet.ServletContextEvent;
import sdm.gcms.database.DatabaseActions;
import sdm.gcms.shared.database.Database;

public class MainServletContextListener implements jakarta.servlet.ServletContextListener {

    @Override
    public void contextDestroyed(ServletContextEvent arg0) {
        //Notification that the servlet context is about to be shut down.   
        DatabaseActions.stop();
   
    }

    @Override
    public void contextInitialized(ServletContextEvent arg0) {
        Database.startUp();
        DatabaseActions.startChronJobs();
    }
}
