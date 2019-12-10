package com.solace.samples;
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

public class SolaceUtility {

	public Object readDataLineByLine(String filePath) 
	{ 
		
		if(filePath!=null) {
			BufferedReader csvReader = null;
			try { 

				csvReader = new BufferedReader(new FileReader(filePath));

			} 
			catch (Exception e) { 
				e.printStackTrace(); 
			} 
			return csvReader;
		}else {
			return null;
		}

		
	}

	public static void completeTask(int sleepTime) {
        try {
            //assuming it takes 20 secs to complete the task
            Thread.sleep(sleepTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
	
	public static JSONObject stringToJSON(String str) {
		
		JSONObject json = null;
		try {
			json = new JSONObject(str);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return json;
	}
	
	
	public static String[] systemConf(String region, int size) {
		

		String[] generic = new String[size]; 

		if(region.equalsIgnoreCase("lowa")) {
			String[] region1 = new String[size];
			//Host Port
			region1[0] = "mr1u6o37qn547p.messaging.solace.cloud:55555";
			//VPN Name
			region1[1] = "emirates-lowa";
			//User Name
			region1[2] = "solace-cloud-client";
			//User Name
			region1[3] = "osmk0npjbjt2n7fah4ha86pn66";
			generic = region1;
		}else if(region.equalsIgnoreCase("singapore")) {
			String[] region3 = new String[size];
			//Host Port
			region3[0] = "mr1u6o37qn544x.messaging.solace.cloud:55555";
			//VPN Name
			region3[1] = "emirates-singapore";
			//User Name
			region3[2] = "solace-cloud-client";
			//User Name
			region3[3] = "9flh068um60qj8okasiqi1se5q";
			generic = region3;
		}else if(region.equalsIgnoreCase("paris")) {
			String[] region2 = new String[size];
			//Host Port
			region2[0] = "mr-1u6o37qn54ah.messaging.solace.cloud:55555";
			//VPN Name
			region2[1] = "emirates-paris";
			//User Name
			region2[2] = "solace-cloud-client";
			//User Name
			region2[3] = "dac22v8f24390csbvf3rpsod7b";
			generic = region2;
		}
		
		return generic;
	}
	
}
