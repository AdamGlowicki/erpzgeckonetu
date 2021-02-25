<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Curl;

class LMS extends Model
{
    public function findClient($string) {
        $response = $this->request(['search_string' => $string]);

        $result = json_decode($response);

        if(!$result) {
            return false;
        }

        foreach($result as $client) {
            unset($client->ssn, $client->icn);

            if(is_int($client)) {
                unset($result[$client]);
                continue;
            }

            if(!isset($client->nodes)) {
                continue;
            }

            if(!is_array($client->nodes)) {
                continue;
            }
        }

        return $result;
    }

    public function paidService($data = []) {
        $response = $this->request([
            'customerid' => $data->client_id,
            'assignmentadd' => true,
            'description' => 'Usługa serwisowa',
            'amount' => $data->price,
            'erptaskid' => $data->event_id,
            'erpdocid' => $data->doc_id,
        ]);
    }

    public function zte() {
        $response = $this->request(['ztelist' => true]);

        $result = json_decode($response);

        return $result;
    }

    public function clientsFromCC() {
        $response = $this->request(['callcenter' => true]);

        $result = json_decode($response);

        return $result;
    }

    public function request($request = []) {
        $data = [
            'loginform[login]' => env('LMS_LOGIN'),
            'loginform[pwd]' => env('LMS_PWD'),
        ];

        if(!empty($request)) {
            $data[key($request)] = array_values($request)[0];
        }

        $response = Curl::to(env('LMS_URL'))
            ->withData($data)
            ->post();

        return $response;
    }
}
