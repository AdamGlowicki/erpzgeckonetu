<?php
declare(strict_types=1);

use ElasticAdapter\Indices\Mapping;
use ElasticAdapter\Indices\Settings;
use ElasticMigrations\Facades\Index;
use ElasticMigrations\MigrationInterface;

final class CreateTerytIndex implements MigrationInterface
{
    /**
     * Run the migration.
     */
    public function up(): void
    {
        Index::create('teryt_city', function (Mapping $mapping, Settings $settings) {
            $mapping->integer('id');
            $mapping->text('city');
            $mapping->text('descr');
        });

        Index::create('teryt_street', function (Mapping $mapping, Settings $settings) {
            $mapping->integer('id');
            $mapping->text('model_name');
            $mapping->text('descr');
        });
    }

    /**
     * Reverse the migration.
     */
    public function down(): void
    {
        //
    }
}
