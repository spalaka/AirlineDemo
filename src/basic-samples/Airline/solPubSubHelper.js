////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Solace Systems Messaging SDK for JavaScript
// Copyright 2010-2012 Solace Systems Inc. All rights reserved.
// http://www.SolaceSystems.com
//
//                              * SolPubSubHelper *
//
// This sample demonstrates:
//  - Subscribing to a topic for direct messages.
//  - Receiving messages with callbacks
//
// This is the helper JavaScripts code, where we show the basics of creating a session, connecting a session, subscribing to a topic,
// and publishing direct messages to a topic.
// This script is invoked by wrapper methods from GUI based applications, and correspondingly calls them back upon receiving messages
// from its event callbacks
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//alert("solPubSubHelper");

    var ns = this;

    var mySessionProperties = null;
    var autoReconnect = true;

    var mySession = null;
    var symbols = {YES:'100',HDFC:'200',ICICI:'300',AXIS:'100',KOTAK:'200',SBI:'300',TATA:'300',MARUTI:'100',MAHIN:'200',EICHER:'300',BAJAJAUTO:'100'};

//    var autoReconnect = false;
//    var mySession = null;

    /** Forward declarations of session callback and message callback methods
    * sessionEvenCb - a callback method defined later in this file,
    * 		which is called by Solace in case a session event such as connect, disconnect, reconnect etc occurs
    *
    * messageEventCb - - a callback method defined later in this file,
    *		which is called by Solace to push messages into, whenever a new message matches the added subscriptions on the session
    */
    var sessionEventCb; // forward declaration
    var messageEventCb; // forward declaration


    // An array of subscriptions that cannot be sent temporarily due to network congestion
    // They will be re-sent upon receiving CAN_ACCEPT_DATA event.
    // The array will be cleared when session is disconnected.
    this.subscriptionsInWaiting = [];


 	/**
     * Creates a session object, to be used for connection later
     * Connectivity parameters such as IP, Port, VPN, Username, Password etc
     * are used to initialize the session object
     *
     * Most importantly, as explained above, this method creates the session by associating it with 2 callback methods
     * message event callback method, for Solace to push the messages into
     * session event callback method, for Solace to push session event messages into
     */
    this.connectSession = function() {
        try {

        	//initialize session properties
        	mySessionProperties = new solace.SessionProperties();

			if (memberExchange == "NSE"){

				mySessionProperties.url = EME_NSE_Url;
				mySessionProperties.vpnName = EME_NSE_Vpn;
				mySessionProperties.userName = EME_NSE_ClientUsername;
				mySessionProperties.password = EME_NSE_Password;

			} else if (memberExchange == "BSE"){

				mySessionProperties.url = EME_BSE_Url;
				mySessionProperties.vpnName = EME_BSE_Vpn;
				mySessionProperties.userName = EME_BSE_ClientUsername;
				mySessionProperties.password = EME_BSE_Password;

			} else {

				mySessionProperties.url = EME_MSE_Url;
				mySessionProperties.vpnName = EME_MSE_Vpn;
				mySessionProperties.userName = EME_MSE_ClientUsername;
				mySessionProperties.password = EME_MSE_Password;

			}

            mySessionProperties.connectTimeoutInMsecs = OPERATION_TIMEOUT;
            mySessionProperties.readTimeoutInMsecs = OPERATION_TIMEOUT;
            mySessionProperties.keepAliveIntervalsLimit = 10;
            mySessionProperties.connectTimeoutInMsecs = 25000;
            mySessionProperties.transportDowngradeTimeoutInMsecs = 5000;
            mySessionProperties.reapplySubscriptions = autoReconnect;

            mySession = solace.SolclientFactory.createSession(mySessionProperties,
                    new solace.MessageRxCBInfo(function(session, message) {
                            ns.messageEventCb(session, message);
                    }, this),
                    new solace.SessionEventCBInfo(function(session, event) {
                        ns.sessionEventCb(session, event);
                    }, this));

            //connect the session
            autoReconnect = false;
            //alert("connectSession about to be triggered:"+mySessionProperties.url);
            //this is where the actual connection initiation begines.
            //The connection may not have been established by the time this method returns.
            //Once the connection is established, an event - sessionEventCode=UP_NOTICE is sent to the session callback method
            //So subscriptions etc should only be added after the sessionEventCode=UP_NOTICE event has been received
            mySession.connect();

            //alert("connectSession triggered");
            ns.logUtil("Initiating Connection");


 		} catch (error) {
           	ns.logUtil("EXCEPTION: Failed to connect session");
            ns.logUtil(error.toString());
            //alert(error.toString());
        }
    };

    /**
     * Invoked when disconnect button is clicked. Disconnects the session, and then disposes it
     */
    this.disconnectSessionAndCleanup = function() {
        logUtil("About to disconnect session...");
        try {
            mySession.disconnect();
            mySession.dispose();
            mySession = null;
            autoReconnect = false;
        } catch (error) {
            ns.logUtil("Failed to disconnect session");
            ns.logUtil(error.toString());
        }
    };

    /**
     * send data to the server side
     */
     this.sendData = function(topic, payload) {

     	var svrStatus = document.getElementById("divSvrStatus").innerHTML;
     	if (svrStatus != "UP") {
     		ns.logUtil("Failed to send message, Conn not UP");
     		return;
     	}
        var msg = solace.SolclientFactory.createMessage();
        msg.setDestination(solace.SolclientFactory.createTopic(topic));
        msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
        msg.setBinaryAttachment(payload);
        msg.setXmlContent(payload);

		try {
			mySession.send(msg);
			ns.logUtil("sent msg:"+payload);
		} catch (error) {
			// failed to send, therefore stop publishing and log the error thrown
			ns.logUtil("Failed to send message '" + msg.toString() + "'");
			ns.logUtil(error.toString() + error.Message);
		}
     };

    /**
     * Invoked to remove subscriptions which have been added to a session
     */
    this.removeSubscription = function(topic_string) {
        ns.logUtil("About to remove subscription '" + topic_string + "'");
        if (mySession !== null) {
            try {
                var topic = solace.SolclientFactory.createTopic(topic_string);
                try {
                    mySession.unsubscribe(topic, true, topic_string, OPERATION_TIMEOUT);
                } catch (e) {
                    if (e instanceof solace.OperationError && e.subcode === solace.ErrorSubcode.INSUFFICIENT_SPACE) {
                        ns.logUtil("Remove subscription blocked");
                        ns.subscriptionsInWaiting.push(
                            {
                                subscription: topic,
                                add: false
                            });
                        return;
                    }
                    throw e;
                }

            } catch (error) {
                ns.logUtil("Failed to add subscription '" + topic_string);
                ns.logUtil(error.toString());
            }
        }
    };


    function loadData(message){

        var payload = message.getBinaryAttachment();
		    var payloadTxt = message.getXmlContent();
    	  var topic_string = message.getDestination().getName();

    	  if (payload == null) payload = payloadTxt;

        this.paintData (topic_string, payload);
    }

    this.paintData = function (topic_string, payload) {
    	try {
        //alert("payload123sdfsfsdfsdfs " + payload);
        objJSON = $.parseJSON(payload);
      //   	var tr_id = topic_string.replace(/\//g, '_');
      //   	var td_id = topic_string.replace(/\//g, '_');
			// var str1 = tr_id.substring(0, 3);
			// var str2 = tr_id.substring(7);
			// //var strEx = tr_id.substring(3, 6);
      var strEx = "NSE";

			var tr_id = "Pas";
      //alert("objJSON" + objJSON);
			$.each(objJSON, function(index, dataValue) {
        //alert("Parse done" + index);

        //alert("index " + index);
        var sNo;
        var passenger;
        var travelClass;
        var membershipNo;
        var membershipStatus;
        var baggageStatus;
        var tier;
        var flightNo;
        var boardingStatus;
        //alert("tick " + tick);
        if(index=="BoardingPassNo"){
				  sNo = dataValue;
          tr_id = tr_id+"_"+sNo
        }

        if(index=="Passenger"){
          passenger = dataValue;
        }

        if(index=="TravelClass"){
         travelClass = dataValue;
        }

        if(index=="MembershipNo"){
          membershipNo = dataValue;
        }

        if(index=="MembershipStatus"){
          membershipStatus = dataValue;
        }

        if(index=="BaggageStatus"){
          baggageStatus = dataValue;
        }

        if(index=="Tier"){
          tier = dataValue;
        }

        if(index=="FlightNo"){
          flightNo = dataValue;
        }

        if(index=="BoardingStatus"){
          boardingStatus = dataValue;
        }

				//Dynamically create/update market data table
				var exchanges = ["NSE"];

				var table = document.getElementById("tab_securities");
				// Add row for new symbol at the end of the table
				//alert(tr_id);

				if(document.getElementById(tr_id)==null) {
					var row = table.insertRow(-1);
					row.classList.add("tr_data");
					row.id = tr_id;


          var chgCell = row.insertCell(-1);
          chgCell.id = tr_id+"_SNo";
          chgCell.classList.add("tab_securities_cell","sno");

          //Price
          var priceCell = row.insertCell(-1);
          priceCell.id = tr_id+"_Passenger";
          priceCell.classList.add("tab_securities_cell","passenger");

          //Volume
          var volumeCell = row.insertCell(-1);
          volumeCell.id = tr_id+"_TravelClass";
          volumeCell.classList.add("tab_securities_cell","travelclass");

          //Volume
          var volumeCell = row.insertCell(-1);
          volumeCell.id = tr_id+"_FlightNo";
          volumeCell.classList.add("tab_securities_cell","flightno");

          var chgCell = row.insertCell(-1);
          chgCell.id = tr_id+"_MembershipNo";
          chgCell.classList.add("tab_securities_cell","membershipno");

          //Price
          var priceCell = row.insertCell(-1);
          priceCell.id = tr_id+"_MembershipStatus";
          priceCell.classList.add("tab_securities_cell","membershipstatus");

          //Volume
          var volumeCell = row.insertCell(-1);
          volumeCell.id = tr_id+"_BaggageStatus";
          volumeCell.classList.add("tab_securities_cell","baggagestatus");

          //Volume
          var volumeCell = row.insertCell(-1);
          volumeCell.id = tr_id+"_Tier";
          volumeCell.classList.add("tab_securities_cell","tier");

          //Volume
          var volumeCell = row.insertCell(-1);
          volumeCell.id = tr_id+"_BoardingStatus";
          volumeCell.classList.add("tab_securities_cell","boardingstatus");
				}
				var sNoCell = document.getElementById(tr_id+"_SNo");
				var passengerCell = document.getElementById(tr_id+"_Passenger");
				var travelClassCell = document.getElementById(tr_id+"_TravelClass");
        var flightNoCell = document.getElementById(tr_id+"_FlightNo");
        var membershipNoCell = document.getElementById(tr_id+"_MembershipNo");
				var membershipStatusCell = document.getElementById(tr_id+"_MembershipStatus");
				var baggageStatusCell = document.getElementById(tr_id+"_BaggageStatus");
        var tierCell = document.getElementById(tr_id+"_Tier");
        var boardingStatusCell = document.getElementById(tr_id+"_BoardingStatus");


        if(index=="BoardingPassNo"){
				  sNoCell.innerHTML = dataValue;
          sNoCell.align = "center"
        }

        if(index=="Passenger"){
          passengerCell.innerHTML = dataValue;
          passengerCell.align = "center"
        }

        if(index=="TravelClass"){
         travelClassCell.innerHTML = dataValue;
         travelClassCell.align = "center"
        }

        if(index=="MembershipNo"){
          membershipNoCell.innerHTML = dataValue;
          membershipNoCell.align = "center"
        }

        if(index=="MembershipStatus"){
          membershipStatusCell.innerHTML = dataValue;
          membershipStatusCell.align = "center"
        }

        if(index=="BaggageStatus"){
          baggageStatusCell.innerHTML = dataValue;
          baggageStatusCell.align = "center"
        }

        if(index=="Tier"){
          tierCell.innerHTML = dataValue;
          tierCell.align = "center"
        }

        if(index=="FlightNo"){
          flightNoCell.innerHTML = dataValue;
          flightNoCell.align = "center"
        }

        if(index=="BoardingStatus"){
          boardingStatusCell.innerHTML = dataValue;
          boardingStatusCell.align = "center"
        }


			});

//
//Memory Leak
//       		this.paintGraph (symbols);


		} catch (error) {
      alert("text123");
			alert("JSON PARSE ERROR="+error);
		}
		    	//alert(stockValues);

    };



    this.paintGraph = function (symbols) {

	//alert("YES:"+symbols.YES+ " HDFC:"+symbols.HDFC + " ICICI:"+symbols.ICICI + " AXIS:"+symbols.AXIS + " Airtel:"+symbols.Airtel + " TATA:"+symbols.TATA);

		var chart = new CanvasJS.Chart("chartContainer",
		{
			theme: "theme4",
			title:{
				text: "Bank Trade Volume"
			},
			data: [
			{
				type: "pie",
				showInLegend: true,
				toolTipContent: "{y} - #percent %",
				yValueFormatString: "#0.#,,. Million",
				legendText: "{indexLabel}",
				dataPoints: [
					{  y: symbols.KOTAK, indexLabel: "KOTAKBANK" },
					{  y: symbols.YES, indexLabel: "YESBANK" },
					{  y: symbols.ICICI, indexLabel: "ICICIBANK" },
					{  y: symbols.HDFC, indexLabel: "HDFC" },
					{  y: symbols.AXIS, indexLabel: "AXISBANK"},
					{  y: symbols.SBI, indexLabel: "SBIN"}
				]
			}
			]
		});
		chart.render();


		var chart1 = new CanvasJS.Chart("chartContainer1",
		{
			theme: "theme4",
			title:{
				text: "Auto Trade Volume"
			},
			data: [
			{
					type: "doughnut",
					startAngle: 0,
					toolTipContent: "{y}",
					legendText: "{indexLabel}",
					showInLegend: true,

				dataPoints: [
					{  y: symbols.TATA, indexLabel: "TATAMOTORS" },
					{  y: symbols.BAJAJAUTO, indexLabel: "BAJAJ-AUTO" },
					{  y: symbols.MAHIN, indexLabel: "M&M" },
					{  y: symbols.EICHER, indexLabel: "EICHERMOT" },
					{  y: symbols.MARUTI, indexLabel: "MARUTI"},
				]
			}
			]
		});
		chart1.render();


/*

		var chart2 = new CanvasJS.Chart("chartContainer2", {
				theme: "theme4" ,
				title: {
					text: "Column Chart"
				},
				axisX: {
					interval: 1
				},
				dataPointWidth: 30,
				data: [{
					type: "column",
					indexLabelLineThickness: 2,
					dataPoints: [
						  { x: 1, y: symbols.YES, indexLabel: "Yes Bank" },
						  { x: 2, y: symbols.HDFC, indexLabel: "HDFC Bank" },
						  { x: 3, y: symbols.ICICI, indexLabel: "ICICI Bank" },
						  { x: 4, y: symbols.AXIS, indexLabel: "Axis Bank" },
						  { x: 6, y: symbols.TATA, indexLabel: "Tata Motors" }
					]
				}]
			});
			chart2.render();




				var chart2 = new CanvasJS.Chart("chartContainer2", {
				title: {
					text: "Column Chart with Index Label and Data Point Width"
				},
				axisX: {
					interval: 10
				},
				dataPointWidth: 60,
				data: [{
					type: "column",
					indexLabelLineThickness: 2,
					dataPoints: [
						  { x: 10, y: symbols.YES, indexLabel: "Yes Bank" },
						  { x: 20, y: symbols.HDFC, indexLabel: "HDFC Bank" },
						  { x: 30, y: symbols.ICICI, indexLabel: "ICICI Bank" },
						  { x: 40, y: symbols.AXIS, indexLabel: "Axis Bank" },
						  { x: 50, y: symbols.TATA, indexLabel: "Tata Motors" }

					]
				}]
			});
			chart.render();
*/

    };


    this.paintDataMySec = function (topic_string, payload) {

    	try {
          alert("paintDataMySec");
        	objJSON = $.parseJSON(payload);
        	var tr_id = topic_string.replace(/\//g, '_');
        	tr_id = tr_id.substring(6)
        	//alert("111"+tr_id)
        	$.each(objJSON, function(index, tick) {
        	// var intChange = tick.Change;


        	//alert(intChange);
        	// 	if(intChange > 0) {
        	// 		altRow = "background-image: -webkit-linear-gradient(top, #00360C 0%, #010133 100%)";
					// txtColor= "color:#00FA37";
					// arrow = "<img src='img/up.png' width='15px' height='15px'/>";
        	// 	}
        	// 	else {
        	// 		altRow = "background-image: -webkit-linear-gradient(top, #005713 0%, #02026B 100%)";
					// txtColor = "color:#FF0000"
					// arrow = "<img src='img/down.png' width='15px' height='15px'/>";
        	// 	}

               styleColRG= "style='"+txtColor+";"+altRow+";padding:2px;font-weight:normal;'";
               styleCol= "style='color:#FFFFFF;"+altRow+";padding:2px;font-weight:normal;'";

				trTick ="<tr id='"+tr_id+"'>";
				trTick += "<td "+styleCol+">"+ tick.CounterName + "</td>";
				trTick += "<td "+styleCol+">"+ arrow + "</td>";
				trTick += "<td "+styleCol+">"+ tick.Quantity + "</td>";
				trTick += "<td "+styleCol+">"+ tick.BuyPrice + "</td>";
				trTick += "<td "+styleColRG+">"+ tick.CurrentPrice + "</td>";
				trTick += "<td "+styleColRG+">"+ tick.Change + "</td>";
				trTick += "<td "+styleColRG+">"+ tick.TotalValue + "</td>";
				trTick += "<td "+styleColRG+">"+ tick.GainLoss + "</td>";
				trTick += "<td "+styleCol+">"+ tick.Status + "</td>";
				trTick +="</tr>";
               });

			$("#"+tr_id).replaceWith(trTick);
		} catch (error) {
      alert("text456");
			alert("JSON PARSE ERROR="+error);
		}

    };


    this.addStackedSubscriptions = function() {

		while (ns.subscriptionsInWaiting.length > 0) {
			var sub = ns.subscriptionsInWaiting[0].subscription;
			var add = ns.subscriptionsInWaiting[0].add;
			ns.logUtil("Resend subscription '" + sub.m_name + "'");
			try {
				if (add) {
					mySession.subscribe(sub, true, sub.m_name, OPERATION_TIMEOUT);
				}
				else {
					mySession.unsubscribe(sub, true, sub.m_name, OPERATION_TIMEOUT);
				}
				ns.subscriptionsInWaiting.shift();
			} catch (e) {
				if (e instanceof solace.OperationError && e.subcode === solace.ErrorSubcode.INSUFFICIENT_SPACE) {
					ns.logUtil("Resend subscription blocked");
					return;
				}
				throw e;
			}
		}
    };
