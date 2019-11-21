
    var OPERATION_TIMEOUT = 30000;
    var REQUEST_TIMEOUT = 5000;


    // Solace Order Request connections parameters for NSE
    var EME_NSE_Url = "ws://mr1u6o37qn544x.messaging.solace.cloud:80";
    var EME_NSE_Vpn = "emirates-singapore";
    var EME_NSE_ClientUsername = "solace-cloud-client";
    var EME_NSE_Password = "9flh068um60qj8okasiqi1se5q";

    // Solace Order Request connections parameters for BSE
    var EME_BSE_Url = "ws://mr1u6o37qn544x.messaging.solace.cloud:80";
    var EME_BSE_Vpn = "emirates-singapore";
    var EME_BSE_ClientUsername = "solace-cloud-client";
    var EME_BSE_Password = "9flh068um60qj8okasiqi1se5q";

    // Solace Order Request connections parameters for MSE
    var EME_MSE_Url = "ws://mr1u6o37qn544x.messaging.solace.cloud:80";
    var EME_MSE_Vpn = "emirates-singapore";
    var EME_MSE_ClientUsername = "solace-cloud-client";
    var EME_MSE_Password = "9flh068um60qj8okasiqi1se5q";


    //Solace Cloud Monitor and Portfolio connection
/*    var my_web_server_url = "wss://mrrwtxvklp4gn.messaging.solace.cloud/smf";
    var my_vpn = "msgvpn-rwtxvklp4ft";
    var my_client_username = "solace-cloud-client";
    var my_password = "Jtmn839koj5pl083d1e49akrq7";*/

 	/**
 	* Global variables which control the session (tcp connection)
 	*/

     var publishIntervalId = null;
     var statsIntervalId = null;
     var elapsedTimeInSecs = 0;
     var connectedOnce = false;
     var previousTick = 0;

      	/**
 	* Global variables which control the session (tcp connection)
     */
