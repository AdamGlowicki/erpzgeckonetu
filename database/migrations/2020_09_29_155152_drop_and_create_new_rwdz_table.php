<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropAndCreateNewRwdzTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('rwdz');

        Schema::create('rwdz', function (Blueprint $table) {
            $table->increments('id');
            $table->string('numer_urzad');
            $table->string('nazwa_organu');
            $table->string('adres_organu');
            $table->date('data_wplywu_wniosku');
            $table->string('numer_decyzji_urzedu');
            $table->date('data_wydania_decyzji');
            $table->string('nazwisko_inwestora');
            $table->string('imie_inwestora');
            $table->string('nazwa_inwestor');
            $table->string('wojewodztwo');
            $table->string('miasto');
            $table->string('terc');
            $table->string('cecha');
            $table->string('cecha_1');
            $table->string('ulica');
            $table->string('ulica_dalej');
            $table->string('nr_domu');
            $table->string('rodzaj_inwestycji');
            $table->string('kategoria');
            $table->string('nazwa_zamierzenia_bud');
            $table->string('nazwa_zam_budowlanego');
            $table->string('kubatura');
            $table->string('projektant_nazwisko');
            $table->string('projektant_imie');
            $table->string('projektant_numer_uprawnien');
            $table->string('jednosta_numer_ew');
            $table->string('obreb_numer');
            $table->string('numer_dzialki');
            $table->string('numer_arkusza_dzialki');
            $table->string('jednostka_stara_numeracja_z_wniosku');
            $table->string('stara_numeracja_obreb_z_wnioskiu');
            $table->string('stara_numeracja_dzialka_z_wniosku');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rwdz');

        Schema::create('rwdz', function (Blueprint $table) {
            $table->increments('id');
            $table->string('numer_urzad');
            $table->string('nazwa_organu');
            $table->string('adres_organu');
            $table->date('data_wplywu_wniosku');
            $table->string('numer_decyzji_urzedu');
            $table->date('data_wydania_decyzji');
            $table->string('nazwisko_inwestora');
            $table->string('imie_inwestora');
            $table->string('nazwa_inwestor');
            $table->string('wojewodztwo');
            $table->string('miasto');
            $table->string('cecha');
            $table->string('ulica');
            $table->string('ulica_dalej');
            $table->string('nr_domu');
            $table->string('rodzaj_inwestycji');
            $table->string('kategoria');
            $table->string('nazwa_zamierzenia_bud');
            $table->string('nazwa_zam_budowlanego');
            $table->string('kubatura');
            $table->string('projektant_nazwisko');
            $table->string('projektant_imie');
            $table->string('projektant_numer_uprawnien');
            $table->string('jednosta_numer_ew');
            $table->string('obreb_numer');
            $table->string('numer_dzialki');
            $table->string('jednostka_stara_numeracja_z_wniosku');
            $table->string('stara_numeracja_obreb_z_wnioskiu');
            $table->string('stara_numeracja_dzialka_z_wniosku');
            $table->timestamps();
        });
    }
}
