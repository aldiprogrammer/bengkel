<?php

namespace Tests\Feature;

use Tests\TestCase;

class PwaManifestTest extends TestCase
{
    public function test_it_serves_the_web_app_manifest(): void
    {
        $response = $this->get('/manifest.webmanifest');

        $response
            ->assertOk()
            ->assertHeader('Content-Type', 'application/manifest+json')
            ->assertJsonPath('name', config('app.name'))
            ->assertJsonPath('short_name', config('app.name'))
            ->assertJsonPath('start_url', '/')
            ->assertJsonPath('display', 'standalone')
            ->assertJsonPath('theme_color', '#16a34a')
            ->assertJsonPath('icons.0.sizes', '192x192')
            ->assertJsonPath('icons.1.sizes', '512x512');

        $this->assertContains(
            'maskable',
            array_column($response->json('icons'), 'purpose'),
        );
    }

    public function test_it_references_existing_icon_files(): void
    {
        $icons = $this->get('/manifest.webmanifest')->json('icons');

        foreach ($icons as $icon) {
            $this->assertFileExists(public_path(ltrim($icon['src'], '/')));
        }
    }
}
