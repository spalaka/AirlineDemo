/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 *  Solace JMS 1.1 Examples: TopicPublisher
 */

package com.solace.samples;

import java.io.BufferedReader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.Message;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.jms.Topic;

import org.json.JSONObject;

import com.solacesystems.jms.SolConnectionFactory;
import com.solacesystems.jms.SolJmsUtility;

/**
 * Publishes a messages to a topic using Solace JMS 1.1 API implementation.
 *
 * This is the Publisher in the Publish/Subscribe messaging pattern.
 */
public class TopicPublisher {

	//final String TOPIC_NAME = "emirates/test";

	public void run(String... args) throws Exception {
		String TOPIC_NAME;
//		String[] split = args[1].split("@");


        String host = args[0];
        String vpnName = args[1];
        String username = args[2];
        String password = args[3];
		String operation = args[4];
		String ffTopic = null;
		String ffJSONData = null;
		String dataFilePath = "";

		System.out.printf("TopicPublisher is connecting to Solace messaging at %s...%n", host);

		if(operation.equalsIgnoreCase("Passengers/Checked_In")) {
			dataFilePath = "./Passengers_Data.txt";
		}else if(operation.equalsIgnoreCase("Boarding/Boarding_Success")) {
			dataFilePath = "./Boarding_Data.txt";
		}else if(operation.equalsIgnoreCase("Baggage/Loaded")) {
			dataFilePath = "./Baggage_Data.txt";
		}else if(operation.equalsIgnoreCase("Loyalty/Tier_Change")) {
			dataFilePath = null;
			ffTopic = args[5];
			ffJSONData = args[6];
		}else {
			dataFilePath = null;
		}

		// Programmatically create the connection factory using default settings
		SolConnectionFactory connectionFactory = SolJmsUtility.createConnectionFactory();
		connectionFactory.setHost(host);
		connectionFactory.setVPN(vpnName);
		connectionFactory.setUsername(username);
		connectionFactory.setPassword(password);

		// Create connection to the Solace router
		Connection connection = connectionFactory.createConnection();

		// Create a non-transacted, auto ACK session.
		Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

		System.out.printf("Connected to the Solace Message VPN '%s' with client username '%s'.%n", vpnName,
				username);

		SolaceUtility solUtil = new SolaceUtility();

		BufferedReader fileReader = (BufferedReader) solUtil.readDataLineByLine(dataFilePath);
		Map<String, String> data = new HashMap<String, String>();
		String row;
		if (fileReader!=null) {
			while ((row = fileReader.readLine()) != null) {

				JSONObject jsonObj = SolaceUtility.stringToJSON(row);


				String boardingPassNo = jsonObj.getString("BoardingPassNo");
				String flightNo = jsonObj.getString("FlightNo");
				String from = jsonObj.getString("From");
				String destination = jsonObj.getString("Destination");

				if(operation.equalsIgnoreCase("Boarding/Boarding_Success")) {
					String memberShipNo = jsonObj.getString("MembershipNo");
					//
					String tier = "Tier";

					data.put(memberShipNo, flightNo+":"+boardingPassNo+":"+tier);

				}

				//TOPIC Function: Airline/Operation/BoardingPassNumber/FlightNumber
				TOPIC_NAME = "myair/"+operation+"/"+flightNo+"/"+boardingPassNo+"/"+from+"/"+destination;
				System.out.println("TOPIC_NAME: "+TOPIC_NAME);

				// Create the publishing topic programmatically
				Topic topic = session.createTopic(TOPIC_NAME);

				// Create the message producer for the created topic
				MessageProducer messageProducer = session.createProducer(topic);

				// Create the message
				TextMessage message = session.createTextMessage(row);


				if(operation.equalsIgnoreCase("Passengers")) {
					SolaceUtility.completeTask(20);
				}else if(operation.equalsIgnoreCase("LoyaltyPrg")){
					SolaceUtility.completeTask(100);
				}else {
					SolaceUtility.completeTask(100);
				}

				// Send the message
				// NOTE: JMS Message Priority is not supported by the Solace Message Bus
				messageProducer.send(topic, message, DeliveryMode.NON_PERSISTENT,
						Message.DEFAULT_PRIORITY, Message.DEFAULT_TIME_TO_LIVE);
				//System.out.println("Sent successfully. Exiting...");



				// Close everything in the order reversed from the opening order
				// NOTE: as the interfaces below extend AutoCloseable,
				// with them it's possible to use the "try-with-resources" Java statement
				// see details at https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html
				messageProducer.close();
			}
			System.out.println(data);
//			if(operation.equalsIgnoreCase("Boarding")) {
//				frequentFlyerUpgrades(data, args);
//			}

		}else if(operation.equalsIgnoreCase("Loyalty/Tier_Change")) {


			//TOPIC Function: Airline/Operation/BoardingPassNumber/FlightNumber
			TOPIC_NAME = ffTopic;

			// Create the publishing topic programmatically
			Topic topic = session.createTopic(TOPIC_NAME);

			// Create the message producer for the created topic
			MessageProducer messageProducer = session.createProducer(topic);

			// Create the message
			TextMessage message = session.createTextMessage(ffJSONData);

			System.out.printf("Sending message '%s' to topic '%s'...%n", message.getText(), topic.toString());


			if(operation.equalsIgnoreCase("Passengers")) {
				SolaceUtility.completeTask(20);
			}else if(operation.equalsIgnoreCase("LoyaltyPrg")){
				SolaceUtility.completeTask(100);
			}else {
				SolaceUtility.completeTask(100);
			}

			// Send the message
			// NOTE: JMS Message Priority is not supported by the Solace Message Bus
			messageProducer.send(topic, message, DeliveryMode.NON_PERSISTENT,
					Message.DEFAULT_PRIORITY, Message.DEFAULT_TIME_TO_LIVE);
			System.out.println("Loyalty Sent successfully. Exiting...");


			// Close everything in the order reversed from the opening order
			// NOTE: as the interfaces below extend AutoCloseable,
			// with them it's possible to use the "try-with-resources" Java statement
			// see details at https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html
			messageProducer.close();

		}

		session.close();
		connection.close();
	}

	public static void main(String... args) throws Exception {
    	String[] strArray = new String[4];
        strArray = SolaceUtility.systemConf("singapore", 4);

		new AirlineMediate().run(strArray);
	}

}
