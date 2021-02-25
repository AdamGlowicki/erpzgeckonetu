<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Automobile extends Model
{
    protected $fillable = ['user_id', 'brand', 'model', 'numberPlate', 'vin', 'oil', 'gasInstallation', 'periodService', 'timingGear', 'summerChangeTire', 'winterChangeTire', 'snowTire', 'summerTire', 'gasDate', 'insurance', 'techPeriod', 'create', 'approval', 'isGas', 'gasHomologous', 'insuranceNumber', 'oilPeriodDate', 'periodServiceDate', 'periodTimingGearDate', 'fuelInspection', 'fuelPeriodDate'];
    protected $table = 'automobiles';

    public function carPhoto() {
        return $this->hasMany(CarPhoto::class);
    }
}
