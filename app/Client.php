<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = ['client_id', 'name', 'address'];

    public function clientsItem() {
        return $this->hasMany('App\ClientsItem');
    }

    public function node() {
        return $this->hasMany('App\Lms\Node', 'ownerid', 'client_id');
    }

    public function search($string) {
        $result = app('App\LMS')->findClient($string);

        foreach($result as $object) {
            unset($object->pin);
        }

        return $result;
    }

    public function checkPin($pin, $client) {
        $result = app('App\LMS')->findClient($client);

        if(count($result) > 1) {
            return false;
        }

        if($result[0]->pin != $pin) {
            return false;
        }

        return true;
    }

    public function add($object) {
        if(!isset($object[0])) {
            return false;
        }

        if($this::where('client_id', $object[0]->id)->exists()) {
            return false;
        }

        $address = '';

        if(isset($object[0]->addresses)) {
            if(isset($object[0]->addresses[0])) {
                if($object[0]->addresses[0]->street !== null) {
                    $address = $object[0]->addresses[0]->street .' '. $object[0]->addresses[0]->house . ($object[0]->addresses[0]->flat !== null ? ' lokal '. $object[0]->addresses[0]->flat : '') .', '. $object[0]->addresses[0]->postoffice;
                } else {
                    $address = $object[0]->addresses[0]->city .' '. $object[0]->addresses[0]->house . ($object[0]->addresses[0]->flat !== null ? ' lokal '. $object[0]->addresses[0]->flat : '') .', '. $object[0]->addresses[0]->postoffice;
                }
            }
        }

        $client = $this::create([
            'client_id' => $object[0]->id,
            'name' => $object[0]->name .' '. $object[0]->lastname,
            'address' => $address,
        ]);

        return $client;
    }
}
