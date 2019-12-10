# AirlineDemo
This demo was built based on the belwo technical components
1. User Interface: HTML and JS
2. Solace: Java Script api and websocket connection
3. Microservices: Solace JCSMP API
4. Striim: TQL

**Functionality:** Simulation of boarding, baggage processing and frequent flyer member tier upgrade.

**Technical Components:**

**AirlineUI:**
This folder contains the statuc UI project (There wont be any dynamic page rendering based on req/res)

AirlineProcess html file loacted under "src/basic-samples/Airline" and you can provide the configuration 
details under configure variables.

This UI will help you to initiate load passenger data into main UI (AirlineCCD html), board the passengers 
and baggage loading.

AirlineCCD (src/basic-samples/Airline) is the master UI to visualize the data loading

**AirlineDemoMicroServices:**
This is based on JCSMP java code with gradle packaging.

Technical Configurtion:
Open SolaceUtility (under src/main/java) java file and provide the required connection details.
Note: This whole demo runs on event mesh, so please ensure there is a three node mesh available to 
provide all the details.

Data Files:
All the JSON data files are provided under resources folder. With the same structue, you can add more records 
or delete records.

Assembling:
After cloning the project and do the necessary changes as per the requirment, got to AirlineDemoMicroServices 
folder and run the below command

./gradlew assemble -q manageDataFiles

Run microservice:
After running the assemble, go to build/staged/bin and run the ./topicPublisher.sh in cmd.

This service will keep listning to the topics and publishing the data to the topic based on the functionality.

Ex: On click "Checked In Passengers" button, a message will be published to "EK/Mediate/Passenger" topic 
and microservice will listen to topic and processe the data to "myair/Passengers/Checked_In/..".

**Solace Configuration:**

Instances: AWS Singapore, Google Iowa & Azure Paris

Queues: 
CabinCrewQ: All the topics which are used for the Airline functionality is mapped to this queue and 
the AirlienCCD UI is listning to this queue to populate the data.

Topics Configured In CabinCrewQ:
myair/Passengers/Checked_In/>
myair/Loyalty/Tier_Change/>
myair/Boarding/Boarding_Success/>
myair/Baggage/Loaded/>

**Striim:**
This project will help you t do the Striim integration. Under the Striim folder you fill find the TQL file. 
By importing the TQL file into Striim platform, you will see a predefind process to upgrade the loyalty passeger tiers. 

Configurations Required:
With in the process, go to publish and listner components and the provide the Solace connection details.




