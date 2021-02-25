<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use SoapClient;

class Callcenter extends Model
{
    public function callcenter()
    {
        $wsdl_proto = 'http';
        $wsdl_host = '91.234.12.62'; //ADRES IP CENTRALI
        $wsdl_host_path = '/userpanel_webservices.php/wsdl';
        $namespace_proto = 'http';
        $namespace_host = '91.234.12.62'; //ADRES IP CENTRALI
        $namespace_path = '/userpanel_webservices.php';
        $location = $namespace_proto . '://' . $namespace_host . $namespace_path;
        $wsdl = $wsdl_proto . '://' . $wsdl_host . $wsdl_host_path;
        $login = 'gecko-api';
        $password = 'FSRGsdceD32#4kij!';


        $client = new SoapClient($wsdl, array('location' => $location, 'soap_version'=>
            SOAP_1_2, 'trace'=>1, 'features'=>SOAP_SINGLE_ELEMENT_ARRAYS));
        $sessionID = $client->login($login, $password, 3600); //poprawne dane autoryzacyjne
        $client->__setCookie('sessionID', $sessionID);

//        $response = $client->getQueuesForCallCenter(9,true);

//        $response = $client->getAgentsForCallcenter(9,true);

//        $response = $client->getCallCenters();


//        $response = $client->getQueues();


//        $response = $client->getAgentsForCallcenter(9,true);



//        $response = $client->getQueuesForCallCenter(9,true);


        $response = $client->getQueue(13, true);

//        $response = $client->getIVRs();


//        $response = $client->getConferences();

//        $response = $client->getIVRs();

        print_r($response);

        $client->logout($sessionID);
    }
}
