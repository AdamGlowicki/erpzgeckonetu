<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AgreementFolder extends Model
{
    protected $table = 'agreement_folders';
    protected $fillable = ['name', 'disable'];

    public function agreementFiles() {
        return $this->hasMany(AgreementFile::class);
    }

    public function deleteAgreementFolder() {
        $this->agreementFiles()->delete();
        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
