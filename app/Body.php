<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Body extends Model
{
    protected $fillable = ['title', 'all_files', 'send_date', 'receive_date', 'status', 'is_second_table', 'second_date', 'is_all_second_files', 'second_status', 'table_id', 'post_second_date', 'email_user_id', 'second_email_user_id'];
    protected $table = 'bodies';

    public function table() {
        return $this->belongsTo(Table::class);
    }
    public function prevFiles() {
        return $this->hasMany(PrevFile::class);
    }
    public function postFiles() {
        return $this->hasMany(PostFile::class);
    }
    public function secondFiles() {
        return $this->hasMany(SecondFile::class);
    }
    public function secondPostFiles() {
        return $this->hasMany(SecondPostFile::class);
    }

    public function deleteBody() {
        $this->prevFiles()->delete();
        $this->postFiles()->delete();
        $this->secondFiles()->delete();
        $this->secondPostFiles()->delete();

        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
