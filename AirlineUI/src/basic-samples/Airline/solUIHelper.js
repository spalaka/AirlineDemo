////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Solace Systems Messaging SDK for JavaScript
// Copyright 2010-2012 Solace Systems Inc. All rights reserved.
// http://www.SolaceSystems.com
//
//                              * solUIHelper *
//
// This file contains methods help painting the UI, and methods to aapend inputs to the log text area
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//alert("solUIHelper");

var js_username = null ;
var memberExchange = null;

var imported = document.createElement('script');
imported.src = 'AirlineQueueConsumer.js';
document.head.appendChild(imported);

function download() {
	//download source
	window.location = "./soldemosrc.zip";
}

function aboutSolace() {
	//About Solace
	window.open("http://www.solacesystems.com");
}

function readme() {
	//New window with documentation
	window.open("./readme.html");
}

function topics_doc() {
	//New window with documentation
	window.open("./topics.html");
}
function documentation() {
	//New window with documentation
	window.open("./api/index.html");
}

function padLeft(str, padChar, length) {
	str = str + "";
	while (str.length < length) {
		str = padChar + str;
	}
	return str;
}

function utils_currentTime() {
	var currentTime = new Date();
	return padLeft(currentTime.getHours(), '0', 2) + ":" +
			padLeft(currentTime.getMinutes(), '0', 2) + ":" +
			padLeft(currentTime.getSeconds(), '0', 2) + "." +
			padLeft(currentTime.getMilliseconds(), '0', 3);
}

function logUtil(line) {
	var message = utils_currentTime() + ":" + line + "\n";
	console.log(message);
	//alert(message);
	//var txtarea = document.getElementById("txaConsoleLog");
	//txtarea.value = message + txtarea.value;
}

function endsWithEven(str) {
    if(eval(str.substring(str.length-1)) %2 >0)
    	return false;
    else
    	return true;
}

function stringReplaceAll(str, find, replace) {
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

function initSolace() {
	connectSession();
	initializeOrdReqSessions();
}

function cleanupTables() {
	$("#tab_securities1 .tr_data").remove();
	$("#tab_portfolio .tr_data").remove();
}


function sendTrackRq() {
	//alert("sendTrackRq()");
	// var fileNo = document.getElementById("fileNo").value;
	// alert("Checking the status of fileNo:"+fileNo);
	//
	//
	// try {
	// 	var msg = solace.SolclientFactory.createMessage();
	// 	// Set the topic to requestTopic
	// 	msg.setDestination(solace.SolclientFactory.createTopic("req/passport/status/file"));
	// 	// Set delivery mode
	// 	msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
	// 	// Set binary attachment
	// 	msg.setBinaryAttachment("Status~"+fileNo);
	//
	// 	//send the request message and wait for reply
	// 	mySession.sendRequest(msg, REQUEST_TIMEOUT, function(session, message) {
	// 		replyReceivedCb(session, message);
	// 	}, function(session, event) {
	// 		replyFailedCb(session, event);
	// 	}, null);
	// } catch (error) {
	//
	// 	logUtil("Failed to send phone request");
	// 	logUtil(error.toString());
	// }
}


function sendNewAppRq() {
//alert("sendNewAppRq()");
	// var givenName = document.getElementById("givenName").value;
	// var surname = document.getElementById("surname").value;
	// var birthDate = document.getElementById("birthDate").value;
	// var birthPlace = document.getElementById("birthPlace").value;
	// var state = document.getElementById("state").value;
	// var district = document.getElementById("district").value;
	// var country = document.getElementById("country").value;
	// var gender = document.getElementById("gender").value;
	// var maritalStatus = document.getElementById("maritalStatus").value;
	// var citizenship = document.getElementById("citizenship").value;
	// var pan = document.getElementById("pan").value;
	// var voterid = document.getElementById("voterid").value;
	// var employmentType = document.getElementById("employmentType").value;
	// var eduQualification = document.getElementById("eduQualification").value;
	// var visibleMark = document.getElementById("visibleMark").value;
	// var aadhaarId = document.getElementById("aadhaarId").value;
	//
	// var appmsg = "NewApp~"+givenName +"~"+ surname +"~"+ birthDate +"~"+ birthPlace +"~"+ state +"~"+ district +"~"+ country +"~"+ gender +"~"+ maritalStatus +"~"+ citizenship +"~"+ pan
	// +"~"+ voterid +"~"+ employmentType +"~"+ eduQualification +"~"+ visibleMark +"~"+ aadhaarId;
	//
	// //alert("DATA"+":"+ appmsg);
	//
	//
	// try {
	// 	var msg = solace.SolclientFactory.createMessage();
	// 	// Set the topic to requestTopic
	// 	msg.setDestination(solace.SolclientFactory.createTopic("req/passport/newapp/file"));
	// 	// Set delivery mode
	// 	msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
	// 	// Set binary attachment
	// 	msg.setBinaryAttachment(appmsg);
	// 	//alert("calling reply msg");
	// 	//send the request message and wait for reply
	// 	mySession.sendRequest(msg, REQUEST_TIMEOUT, function(session, message) {
	// 		replyReceivedNewApp(session, message);
	// 	}, function(session, event) {
	// 		replyFailedCb(session, event);
	// 	}, null);
	// } catch (error) {
	// 	logUtil("Failed to send request");
	// 	logUtil(error.toString());
	// }
}


function sendLoginRq() {
	//alert("sendLoginRq()");

	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var exchComboValue = "NSE";

	if (username == '' || password == '' ){
		alert("Please provide login information");
		return false;
	}

	document.getElementById("exchange-banner").className = "exchangeHeader";
	document.getElementById("exchange-banner").src="../../../cssm/images/newsolace_"+ exchComboValue.toLowerCase() +".png";

	js_username = username;
	memberExchange = exchComboValue;
	window.location.hash = 'sec_top20_vol';
}

function validateLogin() {

	if(js_username== null || js_username== ""){
		window.location.hash = 'home';
		return false
	} else {
		return true
	}

}


function replyReceivedCb(session, message) {
	//alert("test!!!!!!!!!!!");
	logUtil("reply received");

	var text = message.getBinaryAttachment();
	// {"file":"A1234","status":"APPROVED", "dob":"10-04-1975", "fname":"Sumeet", "lname":"Puri", "apptype":"Normal", "recvdate":"12-01-2014"}

	try{
		obj = JSON.parse(text);

		document.getElementById("appStatusLine").innerHTML = obj.status;
		document.getElementById("solfile").innerHTML = obj.file;
		document.getElementById("solfname").innerHTML = obj.fname;
		document.getElementById("sollname").innerHTML = obj.lname;
		document.getElementById("soldob").innerHTML = obj.dob;
		document.getElementById("solapptype").innerHTML = obj.apptype;
		document.getElementById("solrecvdate").innerHTML = obj.recvdate;
		//document.getElementById("appstatus").style.display = "block";

	} catch (error) {
		logUtil("Failed to send phone request");
		logUtil(error.toString());
	}
	logUtil(text);
}

function replyReceivedNewApp(session, message) {

	//alert("in replyReceivedNewApp");
	logUtil("reply received");

	var text = message.getBinaryAttachment();
	// {"file":"A1234","status":"APPROVED", "dob":"10-04-1975", "fname":"Sumeet", "lname":"Puri", "apptype":"Normal", "recvdate":"12-01-2014"}

	try{
		obj = JSON.parse(text);

		document.getElementById("solfile").innerHTML = obj.file;
		alert("Your application is successfully submitted. For future reference use file no.:"+obj.file);

	} catch (error) {
		logUtil("Failed to send phone request");
		logUtil(error.toString());
	}
	logUtil(text);
}

function replyReceivedPortfolio(session, message) {
	var trp_id;
	console.log("replyReceivedPortfolio : "+message);
	alert(text);


	var msgObj = message.getBinaryAttachment();
	var json = msgObj.slice(msgObj.indexOf("{"),msgObj.lastIndexOf("}")+1)
	var jsonObj = JSON.parse(json);
/*
	console.log("Exchange : "+jsonObj.exchange);
	console.log("Type : "+jsonObj.type);
	console.log("Account : "+jsonObj.account);
	console.log("Instruments : "+jsonObj.instruments[0].instrument);
	console.log("Instruments : "+jsonObj.instruments.length);
	*/
	//var sym = JSON.parse(jsonObj.instruments[0]);
	//console.log("sym : "+sym);


	try{

		//make sure portfolio is cleaned up
		$("#tab_portfolio .tr_data").remove();

		for (i = 0; i < jsonObj.instruments.length; i++) {
			var tick = jsonObj.instruments[i];
			var trp_id = tick.instrument;

			//console.log("tick.instrument : "+trp_id);

			var table = document.getElementById("tab_portfolio");
			var row = table.insertRow(-1);
			row.classList.add("tr_data");
			row.id = trp_id;
			//console.log("tick.instrument : "+tick.instrument);

			// Add Symbol Label
			var symbolCell = row.insertCell(0);
			symbolCell.innerHTML = tick.instrument;
			symbolCell.id = trp_id+"_SYM";
			symbolCell.classList.add("tab_portfolio_cell", "symbol");

//			console.log("tick.qty : "+tick.qty);
			//Volume
			var volumeCell = row.insertCell(-1);
			volumeCell.innerHTML = tick.qty;
			volumeCell.id = trp_id+"_VOL";
			volumeCell.classList.add("tab_portfolio_cell","volume");

//			console.log("tick.inv_price : "+tick.inv_price);
			//Price
			var priceCell = row.insertCell(-1);
			priceCell.innerHTML = tick.inv_price;
			priceCell.id = trp_id+"_INV";
			priceCell.classList.add("tab_portfolio_cell", "price");

//			console.log("tick.val : "+parseInt(tick.qty)*parseFloat(tick.inv_price))
			//Value
			var valueCell = row.insertCell(-1);
			valueCell.innerHTML = (parseInt(tick.qty)*parseFloat(tick.inv_price)).toFixed(2);
			valueCell.id = trp_id+"_VAL";
			valueCell.classList.add("tab_portfolio_cell","volume");

//			console.log("tick.val : "+parseInt(tick.qty)*parseFloat(tick.inv_price))
			//Change
			var chgCell = row.insertCell(-1);
			chgCell.innerHTML = "-";
			chgCell.id = trp_id+"_CHG";
			chgCell.classList.add("tab_portfolio_cell","arrow");

			//Live Price
			var lpriceCell = row.insertCell(-1);
			lpriceCell.innerHTML = "-";
			lpriceCell.id = trp_id+"_LPR";
			lpriceCell.classList.add("tab_portfolio_cell","price");

			//Latest Value
			var lvalueCell = row.insertCell(-1);
			lvalueCell.innerHTML = "-";
			lvalueCell.id = trp_id+"_LVAL";
			lvalueCell.classList.add("tab_portfolio_cell","volume");

		}

		//document.getElementById("solfile").innerHTML = obj.file;
		//alert("Portfolio data.:");

	} catch (error) {
		logUtil("Failed to send phone request");
		logUtil(error.toString());
	}

}

function replyReceivedLogin(session, message) {

	//alert("in replyReceivedLogin");
		document.getElementById("sec_top20_vol").disabled = false;

	alert("reply received");

	var text = message.getBinaryAttachment();
	// {"file":"A1234","status":"APPROVED", "dob":"10-04-1975", "fname":"Sumeet", "lname":"Puri", "apptype":"Normal", "recvdate":"12-01-2014"}
	try{
		alert(text);
		obj = JSON.parse(text);
		//$('#tab_securities tr:nth-child(2) td:nth-child(1)').html('foo');

	} catch (error) {
		alert("123");
	alert(error.toString());
		logUtil("Failed to send phone request");
		logUtil(error.toString());
	}
	logUtil(text);
}


function replyFailedCb(session, event) {
alert("Reply Failed!!!");
	logUtil("error callback");
	logUtil(event.infoStr);
	logUtil(event.toString());
}

function statusUpdate(statusText, statusColor) {

	//repaint divHello

	if (statusText == 'Disconnected') {
		document.getElementById("red").src = "../../../img/red-on.png";
		document.getElementById("amber").src = "../../../img/amber-off.png";
		document.getElementById("green").src = "img/green-off.png";
	}
	else if (statusText == 'Connecting') {
		document.getElementById("red").src = "../../../img/red-off.png";
		document.getElementById("amber").src = "../../../img/amber-on.png";
		document.getElementById("green").src = "../../../img/green-off.png";
	}
	else if (statusText == 'Connected') {
		document.getElementById("divSvrStatus").innerHTML = "";
		document.getElementById("red").src = "../../../img/red-off.png";
		document.getElementById("amber").src = "../../../img/amber-off.png";
		document.getElementById("green").src = "../../../img/green-on.png";

		//send a request to the portfolio manager
		sendPortfolioRq();

	}

}




//************************************************************************************
