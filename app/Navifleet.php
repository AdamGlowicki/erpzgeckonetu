<?php

namespace App;

use App\Mail\CarAlertMail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use Ixudra\Curl\Facades\Curl;

class Navifleet extends Model
{
    public function fetchNavifleetByCar($id)
    {
        $response = Curl::to(env('NAVIFLEET_URL') . '/route/details?id=' . $id . '&apikey=' . env('NAVIFLEET_APIKEY'))
            ->get();
        return json_decode($response);
    }

    public function fetchNavifleet()
    {
        $response = Curl::to(env('NAVIFLEET_URL') . '/device/list?apikey=' . env('NAVIFLEET_APIKEY'))
            ->get();
        return json_decode($response);
    }

    private function numberDaysBetweenTodayAndDate($date)
    {
        $now = time();
        $your_date = strtotime($date);
        $dateDiff = $your_date - $now;
        return round($dateDiff / (60 * 60 * 24));
    }

    private function alertArray($id, $type, $kms, $days, $license)
    {
        return ['automobile_id' => $id, 'type' => $type, 'kms' => $kms, 'days' => $days, 'link' => '/react/carService/' . $license];
    }

    private function sendMails($car)
    {
        $carUserMail = User::findOrFail($car->user_id)->email;
        if ($carUserMail) {
            Mail::to([env('WAREHOUSEMAN_MAIL'), $carUserMail])->send(new CarAlertMail(env('CAR_SERVICE_URL') . '/' . $car->numberPlate));
        }
    }

    private function databaseHandle($kmToInspection, $daysToInspection, $alertPeriod, $car, $type)
    {
        if ($kmToInspection < $alertPeriod->kms) {
            CarAlert::create($this->alertArray($car->id, $type, $kmToInspection, null, $car->numberPlate));
        }
        if ($alertPeriod->days > $daysToInspection) {
            CarAlert::create($this->alertArray($car->id, $type, null, $daysToInspection, $car->numberPlate));
        }
        if ($kmToInspection < $alertPeriod->kms || $alertPeriod->days > $daysToInspection) {
            $this->sendMails($car);
        }
    }

    private function getKmsToInspection($mileage, $interval)
    {
        if ($interval) {
            return $mileage % $interval;
        }
        return 0;
    }

    private function checkOil($alertPeriod, $mileage, $car)
    {
        $kmToInspection = $this->getKmsToInspection($mileage, $car->oil);
        $dt = $car->oilPeriodDate;
        $daysToInspection = $this->numberDaysBetweenTodayAndDate($dt);

        $this->databaseHandle($kmToInspection, $daysToInspection, $alertPeriod, $car, 'oilService');
    }

    private function checkGeneralInspection($alertPeriod, $mileage, $car)
    {
        $kmToInspection = $this->getKmsToInspection($mileage, $car->periodService);
        $dt = $car->periodServiceDate;
        $daysToInspection = $this->numberDaysBetweenTodayAndDate($dt);

        $this->databaseHandle($kmToInspection, $daysToInspection, $alertPeriod, $car, 'generalService');
    }

    private function checkTimingGearInspection($alertPeriod, $mileage, $car)
    {
        $kmToInspection = $this->getKmsToInspection($mileage, $car->fuelInspection);
        $dt = $car->periodTimingGearDate;
        $daysToInspection = $this->numberDaysBetweenTodayAndDate($dt);

        $this->databaseHandle($kmToInspection, $daysToInspection, $alertPeriod, $car, 'timingGearService');
    }

    private function checkFuelInspection($alertPeriod, $mileage, $car) {
        $kmToInspection = $this->getKmsToInspection($mileage, $car->timingGear);
        $dt = $car->fuelPeriodDate;
        $daysToInspection = $this->numberDaysBetweenTodayAndDate($dt);

        $this->databaseHandle($kmToInspection, $daysToInspection, $alertPeriod, $car, 'fuelService');
    }

    private function checkGasInspection($alertPeriod, $mileage, $car)
    {
        if ($car->isGas) {
            $kmToInspection = $this->getKmsToInspection($mileage, $car->gasInstallation);
            $dt = $car->gasDate;
            $daysToInspection = $this->numberDaysBetweenTodayAndDate($dt);

            $homologueDate = $car->gasHomologous;
            $daysToHomologue = $this->numberDaysBetweenTodayAndDate($homologueDate);

            $this->databaseHandle($kmToInspection, $daysToInspection, $alertPeriod, $car, 'gasService');

            if ($alertPeriod->days > $daysToHomologue) {
                CarAlert::create($this->alertArray($car->id, 'gasHomologue', null, $daysToHomologue, $car->numberPlate));
                $this->sendMails($car);
            }
        }
    }

    private function checkSummerChangeTire($alertPeriod, $car)
    {
        $dt = $car->summerChangeTire;
        $daysToInspection = $this->numberDaysBetweenTodayAndDate($dt);

        if ($alertPeriod->days > $daysToInspection) {
            CarAlert::create($this->alertArray($car->id, 'summerChange', null, $daysToInspection, $car->numberPlate));
            $this->sendMails($car);
        }
    }

    private function checkWinterChangeTire($alertPeriod, $car)
    {
        $dt = $car->winterChangeTire;
        $daysToInspection = $this->numberDaysBetweenTodayAndDate($dt);

        if ($alertPeriod->days > $daysToInspection) {
            CarAlert::create($this->alertArray($car->id, 'winterChange', null, $daysToInspection, $car->numberPlate));
            $this->sendMails($car);
        }
    }

    private function checkInsurance($alertPeriod, $car)
    {
        $dt = $car->insurance;
        $daysToInspection = $this->numberDaysBetweenTodayAndDate($dt);

        if ($alertPeriod->days > $daysToInspection) {
            CarAlert::create($this->alertArray($car->id, 'insurance', null, $daysToInspection, $car->numberPlate));
            $this->sendMails($car);
        }
    }

    public function check()
    {
        $cars = $this->fetchNavifleet()->data;
        $alertPeriod = json_decode(AlertPeriod::get(['kms', 'days'])->first());

        if (CarAlert::first()) {
            CarAlert::all()->each(function ($item) {
                CarAlert::findOrFail($item->id)->delete();
            });
        }

        foreach ($cars as $car) {
            $navifleetCar = $this->fetchNavifleetByCar($car->id)->data;
            $mileage = $navifleetCar->mileage;

            $carByNumberPlate = json_decode(Automobile::where('numberPlate', str_replace(' ', '', $car->license))->first());

            if ($carByNumberPlate) {
                $this->checkOil($alertPeriod, $mileage, $carByNumberPlate);
                $this->checkTimingGearInspection($alertPeriod, $mileage, $carByNumberPlate);
                $this->checkGeneralInspection($alertPeriod, $mileage, $carByNumberPlate);
                $this->checkGasInspection($alertPeriod, $mileage, $carByNumberPlate);
                $this->checkSummerChangeTire($alertPeriod, $carByNumberPlate);
                $this->checkWinterChangeTire($alertPeriod, $carByNumberPlate);
                $this->checkInsurance($alertPeriod, $carByNumberPlate);
                $this->checkFuelInspection($alertPeriod, $mileage, $carByNumberPlate);
            }
        }
    }
}
