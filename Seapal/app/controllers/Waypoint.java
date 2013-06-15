package controllers;

import play.*;
import play.mvc.*;
import play.db.*;

import java.sql.*;

import javax.sql.*;
import play.libs.Json;
import play.data.DynamicForm;
import org.codehaus.jackson.node.ObjectNode; 
import views.html.*;
import views.html._include.*;

public class Waypoint extends Controller {  
    
  public static Result load(int wnr) {
  
    Connection conn = DB.getConnection();
    Statement query;
    ResultSet result;
    ObjectNode respJSON = Json.newObject();

		if(conn != null)
		{
        try {
            	
	          query = conn.createStatement();
	 
	          String sql = "SELECT * FROM seapal.wegpunkte WHERE wnr = " + wnr;
	        
	          result = query.executeQuery(sql);
            java.sql.ResultSetMetaData rsmd = result.getMetaData();
            int numColumns = rsmd.getColumnCount();

            while (result.next()) {
                for (int i = 1; i < numColumns + 1; i++) {
                    String columnName = rsmd.getColumnName(i);
                    respJSON.put(columnName, result.getString(i));
                }
            }
            conn.close();

        } catch (Exception e) {
	    	   e.printStackTrace();
        }
    }
    return ok(respJSON);
  }

  public static Result index(int wnr) {
      
      load(wnr);
      
      return ok(waypoint.render(header.render(), navigation.render("app_map"), navigation_app.render("app_waypoint")));
  }
  
  public static Result update() {
	    DynamicForm data = form().bindFromRequest();
	    Connection conn = DB.getConnection();
		Statement query;  
	    ObjectNode respJSON = Json.newObject();

	    try {
		    query = conn.createStatement();

		    query.execute("UPDATE seapal.wegpunkte SET "
	                + data.get("field") + " = "
	                + "'" + data.get("value") + "' WHERE "
	                + "wnr = " + data.get("wnr") 
	                + ";");

	         conn.close(); 

	         respJSON.put("status", "successful");

	    } catch (Exception e) {
	        respJSON.put("status", "unsuccessful, " + e);
	    }

	    return ok(respJSON);

  }
  
  public static Result fillWithDefaults() {
	  DynamicForm data = form().bindFromRequest();
	  Connection conn = DB.getConnection();
	  Statement query;  
	  ObjectNode respJSON = Json.newObject();

	  try {
		  query = conn.createStatement();
          query.execute("UPDATE seapal.wegpunkte SET wcc=NULL WHERE wnr=" + data.get("wnr") + ";");
          query.execute("UPDATE seapal.wegpunkte SET icon=NULL WHERE wnr=" + data.get("wnr") + ";");
          query.execute("UPDATE seapal.wegpunkte SET temp=NULL WHERE wnr=" + data.get("wnr") + ";");
          query.execute("UPDATE seapal.wegpunkte SET airpressure=NULL WHERE wnr=" + data.get("wnr") + ";");
          query.execute("UPDATE seapal.wegpunkte SET windspeed=NULL WHERE wnr=" + data.get("wnr") + ";");
          query.execute("UPDATE seapal.wegpunkte SET winddirection=NULL WHERE wnr=" + data.get("wnr") + ";");
          query.execute("UPDATE seapal.wegpunkte SET precipation=NULL WHERE wnr=" + data.get("wnr") + ";");
          query.execute("UPDATE seapal.wegpunkte SET clouds=NULL WHERE wnr=" + data.get("wnr") + ";");
          query.execute("UPDATE seapal.wegpunkte SET wavehight=NULL WHERE wnr=" + data.get("wnr") + ";");
          query.execute("UPDATE seapal.wegpunkte SET wavedirection=NULL WHERE wnr=" + data.get("wnr") + ";");
	      conn.close(); 

	      respJSON.put("status", "successful");

	  } catch (Exception e) {
	      respJSON.put("status", "unsuccessful, " + e);
	  }

	  return ok(respJSON);

  }
}