<?php

namespace Tests\Feature;

use App\Models\Jasa;
use App\Models\Kategori;
use App\Models\Listorder;
use App\Models\Order;
use App\Models\Pegawai;
use App\Models\Pelanggan;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiV1Test extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_customers(): void
    {
        Pelanggan::factory()->count(2)->create();

        $this->getJson('/api/v1/pelanggan')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_it_creates_a_customer(): void
    {
        $this->postJson('/api/v1/pelanggan', [
            'kode_pelanggan' => 'PLG-7001',
            'nama' => 'Budi Santoso',
            'no_hp' => '0812-3456-7890',
            'alamat' => 'Jl. Melati No. 12',
            'kendaraan' => 'Toyota Avanza',
            'nomor_plat' => 'B 1023 XYZ',
        ])
            ->assertCreated()
            ->assertJsonPath('data.kode_pelanggan', 'PLG-7001');

        $this->assertDatabaseHas('pelanggan', ['kode_pelanggan' => 'PLG-7001']);
    }

    public function test_it_validates_customer_payload(): void
    {
        $this->postJson('/api/v1/pelanggan', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'kode_pelanggan',
                'nama',
                'no_hp',
                'alamat',
                'kendaraan',
                'nomor_plat',
            ]);
    }

    public function test_it_shows_updates_and_deletes_a_customer(): void
    {
        $pelanggan = Pelanggan::factory()->create();

        $this->getJson("/api/v1/pelanggan/{$pelanggan->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $pelanggan->id);

        $this->putJson("/api/v1/pelanggan/{$pelanggan->id}", [
            'kode_pelanggan' => $pelanggan->kode_pelanggan,
            'nama' => 'Nama Baru',
            'no_hp' => '0812-9999-0000',
            'alamat' => 'Alamat Baru',
            'kendaraan' => 'Honda Beat',
            'nomor_plat' => 'B 1111 AA',
        ])
            ->assertOk()
            ->assertJsonPath('data.nama', 'Nama Baru');

        $this->deleteJson("/api/v1/pelanggan/{$pelanggan->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('pelanggan', ['id' => $pelanggan->id]);
    }

    public function test_it_returns_not_found_for_missing_customer(): void
    {
        $this->getJson('/api/v1/pelanggan/9999')->assertNotFound();
    }

    public function test_it_lists_employees(): void
    {
        Pegawai::factory()->count(3)->create();

        $this->getJson('/api/v1/pegawai')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_it_creates_and_validates_an_employee(): void
    {
        $this->postJson('/api/v1/pegawai', [
            'kode_pegawai' => 'PEG-7001',
            'nama' => 'Agus Setiawan',
            'jabatan' => 'Mekanik',
            'no_hp' => '0812-1111-2222',
            'email' => 'agus@posbengkel.test',
            'alamat' => 'Jl. Melati No. 5',
            'tanggal_masuk' => '2020-06-15',
            'status' => 'Aktif',
        ])
            ->assertCreated()
            ->assertJsonPath('data.kode_pegawai', 'PEG-7001');

        $this->postJson('/api/v1/pegawai', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['kode_pegawai', 'nama', 'jabatan']);
    }

    public function test_it_lists_users_without_exposing_the_password(): void
    {
        User::factory()->create();

        $this->getJson('/api/v1/pengguna')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonMissingPath('data.0.password')
            ->assertJsonStructure(['data' => [['id', 'name', 'email', 'role']]]);
    }

    public function test_it_creates_a_user_and_hashes_the_password(): void
    {
        $this->postJson('/api/v1/pengguna', [
            'name' => 'Kasir Baru',
            'email' => 'kasir.baru@posbengkel.test',
            'role' => 'Kasir',
            'password' => 'rahasia123',
        ])
            ->assertCreated()
            ->assertJsonPath('data.role', 'Kasir');

        $created = User::query()->where('email', 'kasir.baru@posbengkel.test')->firstOrFail();
        $this->assertTrue(Hash::check('rahasia123', $created->password));
    }

    public function test_it_updates_a_user_without_changing_the_password(): void
    {
        $user = User::factory()->create(['password' => 'password']);

        $this->putJson("/api/v1/pengguna/{$user->id}", [
            'name' => 'Nama Baru',
            'email' => $user->email,
            'role' => 'Admin',
            'password' => '',
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Nama Baru');

        $user->refresh();
        $this->assertTrue(Hash::check('password', $user->password));
    }

    public function test_it_lists_and_creates_categories(): void
    {
        Kategori::factory()->count(2)->create();

        $this->getJson('/api/v1/kategori')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->postJson('/api/v1/kategori', [
            'kode_kategori' => 'KAT-7001',
            'nama_kategori' => 'Pelumas',
        ])
            ->assertCreated()
            ->assertJsonPath('data.kode_kategori', 'KAT-7001');
    }

    public function test_it_lists_products_with_their_category(): void
    {
        $kategori = Kategori::factory()->create(['nama_kategori' => 'Pelumas']);
        Produk::factory()->create(['kategori_id' => $kategori->id]);

        $this->getJson('/api/v1/produk')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.kategori.nama_kategori', 'Pelumas');
    }

    public function test_it_creates_and_validates_a_product(): void
    {
        $kategori = Kategori::factory()->create();

        $this->postJson('/api/v1/produk', [
            'kode_produk' => 'BRG-7001',
            'nama_produk' => 'Oli Mesin 10W-40',
            'kategori_id' => $kategori->id,
            'satuan' => 'Btl',
            'stok' => 48,
            'harga_beli' => 55000,
            'harga_jual' => 65000,
            'diskon' => 10,
            'tanggal_masuk' => '2026-09-01',
        ])
            ->assertCreated()
            ->assertJsonPath('data.kode_produk', 'BRG-7001');

        $this->postJson('/api/v1/produk', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['kode_produk', 'kategori_id', 'satuan']);
    }

    public function test_it_lists_creates_and_deletes_a_service(): void
    {
        Jasa::factory()->count(2)->create();

        $this->getJson('/api/v1/jasa')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $response = $this->postJson('/api/v1/jasa', [
            'kode_jasa' => 'JSA-7001',
            'nama_jasa' => 'Servis Rutin',
            'harga' => 150000,
        ])->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/jasa/{$id}")->assertNoContent();

        $this->assertDatabaseMissing('jasa', ['id' => $id]);
    }

    public function test_it_lists_and_creates_an_order(): void
    {
        Order::factory()->count(2)->create();

        $this->getJson('/api/v1/order')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->postJson('/api/v1/order', [
            'kode_order' => 'ORD-7001',
            'pelanggan' => 'Budi Santoso',
            'montir' => 'Agus Setiawan',
            'uang' => 300000,
            'kembalian' => 35000,
            'metode_pembayaran' => 'Tunai',
            'total_harga' => 265000,
            'diskon' => 0,
            'grand_total' => 265000,
            'tanggal' => '2026-09-21',
            'status_struk' => 'Belum Cetak',
        ])
            ->assertCreated()
            ->assertJsonPath('data.kode_order', 'ORD-7001');

        $this->assertDatabaseHas('order', ['kode_order' => 'ORD-7001']);
    }

    public function test_it_validates_an_order_payload(): void
    {
        $this->postJson('/api/v1/order', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'kode_order',
                'pelanggan',
                'uang',
                'kembalian',
                'metode_pembayaran',
                'total_harga',
                'diskon',
                'grand_total',
                'tanggal',
            ]);
    }

    public function test_it_shows_an_order_with_its_items_and_deletes_it(): void
    {
        $order = Order::factory()->create();
        Listorder::factory()->create(['kode_order' => $order->kode_order]);

        $this->getJson("/api/v1/order/{$order->id}")
            ->assertOk()
            ->assertJsonPath('data.kode_order', $order->kode_order)
            ->assertJsonCount(1, 'data.listorder');

        $this->deleteJson("/api/v1/order/{$order->id}")->assertNoContent();

        $this->assertDatabaseMissing('order', ['id' => $order->id]);
    }

    public function test_it_lists_and_creates_an_order_item(): void
    {
        $order = Order::factory()->create();
        $produk = Produk::factory()->create();
        $user = User::factory()->create();

        Listorder::factory()->create(['kode_order' => $order->kode_order]);

        $this->getJson('/api/v1/listorder')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonStructure(['data' => [['id', 'kode_order', 'harga', 'qty', 'produk', 'jasa', 'kasir']]]);

        $this->postJson('/api/v1/listorder', [
            'kode_order' => $order->kode_order,
            'kode_produk' => $produk->kode_produk,
            'kode_jasa' => null,
            'harga' => 65000,
            'qty' => 2,
            'diskon' => 0,
            'id_kasir' => $user->id,
            'tanggal' => '2026-09-21',
        ])
            ->assertCreated()
            ->assertJsonPath('data.kode_produk', $produk->kode_produk);

        $this->assertDatabaseHas('listorder', [
            'kode_order' => $order->kode_order,
            'kode_produk' => $produk->kode_produk,
        ]);
    }

    public function test_it_validates_an_order_item_payload(): void
    {
        $this->postJson('/api/v1/listorder', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'kode_order',
                'kode_produk',
                'kode_jasa',
                'harga',
                'qty',
                'diskon',
                'id_kasir',
                'tanggal',
            ]);
    }
}
