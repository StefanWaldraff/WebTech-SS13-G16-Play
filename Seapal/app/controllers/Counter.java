package controllers;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintStream;

import org.codehaus.jackson.node.ObjectNode;

import play.*;
import play.libs.Json;
import play.mvc.*;

import views.html.*;
import views.html._include.*;

public class Counter extends Controller {
  
	public static Result load() {
    	
    	ObjectNode respJSON = Json.newObject();
    	FileOutputStream writer = null;
		PrintStream printer = null;
		BufferedReader br = null;
		String path = "logs/counter";
    	
    	try {
    		
    		// Get count value from file
	    	br = new BufferedReader(new FileReader(path));
	    	int count = br.read();
	    	br.close();
	    	
	    	// Write back new count value
	    	writer = new FileOutputStream(path);
		    printer = new PrintStream(writer);
			printer.println(count+1);
			printer.close();
			writer.close();
	    		    	
	    	// Create Json
	    	respJSON.put("current", count);
	    	
	    	// Send back Json object
	    	return ok(respJSON);
	    }
    	catch(IOException e) {
    		return ok(Json.newObject());
    	}
        
    }
	
}