package controllers;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintStream;

import org.codehaus.jackson.node.ObjectNode;

import play.data.DynamicForm;
import play.libs.Json;
import play.mvc.*;

public class Chat extends Controller {
	
	public static Result send() {
		
		DynamicForm data = form().bindFromRequest();
		
		FileOutputStream writer = null;
		PrintStream printer = null;
		
		try {
			writer = new FileOutputStream("logs/data.txt");
		    printer = new PrintStream(writer);
			printer.println(data.get("lat"));
			printer.println(data.get("lon"));
			printer.close();
			writer.close();			
			return ok("Success");
		} catch (IOException e) {
			return ok("Error");
		}	
	}
  
    public static Result load() {
    	    	
    	ObjectNode respJSON = Json.newObject();
    	
    	try {
    		
    		// Get values
	    	BufferedReader br = new BufferedReader(new FileReader("logs/data.txt"));
	    	String lat = br.readLine();
	    	String lon = br.readLine();
	    	long mod = new File("logs/data.txt").lastModified();
	    	br.close();
	    	
	    	// Validate values 
	    	lat = lat != null ? lat : "0";
	    	lon = lon != null ? lon : "0";
	    	
	    	// Create Json
	    	respJSON.put("lat", lat);
	    	respJSON.put("lon", lon);	    	
	    	respJSON.put("timestamp", mod);    	
	    	
	    	// Send back Json object
	    	return ok(respJSON);
	    }
    	catch(IOException e) {
    		return ok(Json.newObject());
    	}
        
    }
}