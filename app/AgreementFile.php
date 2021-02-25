<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AgreementFile extends Model
{
    protected $table = 'agreement_files';
    protected $fillable = ['name', 'data', 'agreement_folder_id'];

    public function agreementFolders() {
        return $this->belongsTo(AgreementFolder::class);
    }
}
