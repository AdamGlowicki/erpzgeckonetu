<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeFileColumnToFileIdInEventsNotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('events_notes', function (Blueprint $table) {
            $table->dropColumn('file');
            $table->unsignedInteger('file_id')->nullable()->default(null)->after('id');

            $table->foreign('file_id')->references('id')->on('files');
        });

        $result = \App\EventsNote::all();

        foreach($result as $note) {
            if(!filter_var($note->note, FILTER_VALIDATE_URL)) {
                continue;
            }

            $filename = basename($note->note);

            $file = \App\File::where('path', 'files/'. $filename)->first();

            if($file) {
                $note->update([
                    'file_id' => $file->id,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('events_notes', function (Blueprint $table) {
            $table->dropForeign(['file_id']);
            $table->dropColumn('file_id');

            $table->boolean('file')->default(false)->after('note');
        });
    }
}
