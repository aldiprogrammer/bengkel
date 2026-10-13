<?php

namespace Tests\Feature;

use App\Models\Jasa;
use App\Models\Kategori;
use App\Models\Pegawai;
use App\Models\Pelanggan;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_the_login_screen_can_be_rendered(): void
    {
        $this->get('/login')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Auth/Login'));
    }

    public function test_users_can_authenticate(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/dashboard');
    }

    public function test_users_cannot_authenticate_with_an_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_authenticated_users_can_visit_the_dashboard(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('stats', 4)
                ->has('recentOrders')
            );
    }

    public function test_authenticated_users_can_visit_each_module_page(): void
    {
        $user = User::factory()->create();

        $pages = [
            '/pelanggan' => 'Pelanggan/Index',
            '/pegawai' => 'Pegawai/Index',
            '/pengguna' => 'Pengguna/Index',
            '/kendaraan' => 'Kendaraan/Index',
            '/servis' => 'Servis/Index',
            '/produk' => 'Produk/Index',
            '/jasa' => 'Jasa/Index',
            '/kategori' => 'Kategori/Index',
            '/transaksi' => 'Transaksi/Index',
            '/laporan' => 'Laporan/Index',
            '/pengaturan' => 'Pengaturan/Index',
        ];

        foreach ($pages as $url => $component) {
            $this->actingAs($user)
                ->get($url)
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page->component($component));
        }
    }

    public function test_pelanggan_page_lists_customers_from_the_database(): void
    {
        $user = User::factory()->create();

        Pelanggan::factory()->create([
            'kode_pelanggan' => 'PLG-9001',
            'nama' => 'Budi Santoso',
            'no_hp' => '0812-3456-7890',
            'alamat' => 'Jl. Melati No. 12',
            'kendaraan' => 'Toyota Avanza',
            'nomor_plat' => 'B 1023 XYZ',
        ]);

        $this->actingAs($user)
            ->get('/pelanggan')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Pelanggan/Index')
                ->has('pelanggan', 1)
                ->where('pelanggan.0.kode_pelanggan', 'PLG-9001')
                ->where('pelanggan.0.nama', 'Budi Santoso')
                ->where('pelanggan.0.no_hp', '0812-3456-7890')
                ->where('pelanggan.0.nomor_plat', 'B 1023 XYZ')
            );
    }

    public function test_users_can_create_a_customer(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/pelanggan', [
            'kode_pelanggan' => 'PLG-9002',
            'nama' => 'Siti Aminah',
            'no_hp' => '0812-0000-1111',
            'alamat' => 'Jl. Kenanga No. 8',
            'kendaraan' => 'Honda Beat',
            'nomor_plat' => 'B 4521 QW',
        ]);

        $response->assertRedirect('/pelanggan');
        $this->assertDatabaseHas('pelanggan', [
            'kode_pelanggan' => 'PLG-9002',
            'nama' => 'Siti Aminah',
        ]);
    }

    public function test_creating_a_customer_requires_valid_data(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/pelanggan', [])
            ->assertSessionHasErrors([
                'kode_pelanggan',
                'nama',
                'no_hp',
                'alamat',
                'kendaraan',
                'nomor_plat',
            ]);

        $this->assertDatabaseCount('pelanggan', 0);
    }

    public function test_customer_code_must_be_unique(): void
    {
        $user = User::factory()->create();
        Pelanggan::factory()->create(['kode_pelanggan' => 'PLG-9003']);

        $this->actingAs($user)
            ->post('/pelanggan', [
                'kode_pelanggan' => 'PLG-9003',
                'nama' => 'Nama Lain',
                'no_hp' => '0812-0000-2222',
                'alamat' => 'Jl. Lain No. 1',
                'kendaraan' => 'Suzuki Ertiga',
                'nomor_plat' => 'B 2222 BB',
            ])
            ->assertSessionHasErrors('kode_pelanggan');
    }

    public function test_users_can_update_a_customer(): void
    {
        $user = User::factory()->create();
        $pelanggan = Pelanggan::factory()->create(['nama' => 'Nama Lama']);

        $response = $this->actingAs($user)->put("/pelanggan/{$pelanggan->id}", [
            'kode_pelanggan' => $pelanggan->kode_pelanggan,
            'nama' => 'Nama Baru',
            'no_hp' => '0812-9999-0000',
            'alamat' => 'Alamat Baru',
            'kendaraan' => 'Toyota Avanza',
            'nomor_plat' => 'B 1111 AA',
        ]);

        $response->assertRedirect('/pelanggan');
        $this->assertDatabaseHas('pelanggan', [
            'id' => $pelanggan->id,
            'nama' => 'Nama Baru',
            'nomor_plat' => 'B 1111 AA',
        ]);
    }

    public function test_users_can_delete_a_customer(): void
    {
        $user = User::factory()->create();
        $pelanggan = Pelanggan::factory()->create();

        $this->actingAs($user)
            ->delete("/pelanggan/{$pelanggan->id}")
            ->assertRedirect('/pelanggan');

        $this->assertDatabaseMissing('pelanggan', ['id' => $pelanggan->id]);
    }

    public function test_pegawai_page_lists_employees_from_the_database(): void
    {
        $user = User::factory()->create();

        Pegawai::factory()->create([
            'kode_pegawai' => 'PEG-9001',
            'nama' => 'Agus Setiawan',
            'jabatan' => 'Mekanik',
            'no_hp' => '0812-1111-2222',
            'email' => 'agus@posbengkel.test',
            'alamat' => 'Jl. Melati No. 5',
            'tanggal_masuk' => '2020-06-15',
            'status' => 'Aktif',
        ]);

        $this->actingAs($user)
            ->get('/pegawai')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Pegawai/Index')
                ->has('pegawai', 1)
                ->where('pegawai.0.kode_pegawai', 'PEG-9001')
                ->where('pegawai.0.nama', 'Agus Setiawan')
                ->where('pegawai.0.jabatan', 'Mekanik')
                ->where('pegawai.0.status', 'Aktif')
            );
    }

    public function test_users_can_create_an_employee(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/pegawai', [
            'kode_pegawai' => 'PEG-9002',
            'nama' => 'Bambang Prasetyo',
            'jabatan' => 'Mekanik',
            'no_hp' => '0813-3333-4444',
            'email' => 'bambang@posbengkel.test',
            'alamat' => 'Jl. Kenanga No. 18',
            'tanggal_masuk' => '2021-03-01',
            'status' => 'Aktif',
        ]);

        $response->assertRedirect('/pegawai');
        $this->assertDatabaseHas('pegawai', [
            'kode_pegawai' => 'PEG-9002',
            'nama' => 'Bambang Prasetyo',
            'jabatan' => 'Mekanik',
        ]);
    }

    public function test_creating_an_employee_requires_valid_data(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/pegawai', [])
            ->assertSessionHasErrors([
                'kode_pegawai',
                'nama',
                'jabatan',
                'no_hp',
                'alamat',
                'tanggal_masuk',
                'status',
            ]);

        $this->assertDatabaseCount('pegawai', 0);
    }

    public function test_employee_code_must_be_unique(): void
    {
        $user = User::factory()->create();
        Pegawai::factory()->create(['kode_pegawai' => 'PEG-9003']);

        $this->actingAs($user)
            ->post('/pegawai', [
                'kode_pegawai' => 'PEG-9003',
                'nama' => 'Nama Lain',
                'jabatan' => 'Kasir',
                'no_hp' => '0812-0000-2222',
                'email' => 'lain@posbengkel.test',
                'alamat' => 'Jl. Lain No. 1',
                'tanggal_masuk' => '2022-01-01',
                'status' => 'Aktif',
            ])
            ->assertSessionHasErrors('kode_pegawai');
    }

    public function test_users_can_update_an_employee(): void
    {
        $user = User::factory()->create();
        $pegawai = Pegawai::factory()->create(['nama' => 'Nama Lama']);

        $response = $this->actingAs($user)->put("/pegawai/{$pegawai->id}", [
            'kode_pegawai' => $pegawai->kode_pegawai,
            'nama' => 'Nama Baru',
            'jabatan' => 'Kepala Bengkel',
            'no_hp' => '0812-9999-0000',
            'email' => 'baru@posbengkel.test',
            'alamat' => 'Alamat Baru',
            'tanggal_masuk' => '2023-05-20',
            'status' => 'Nonaktif',
        ]);

        $response->assertRedirect('/pegawai');
        $this->assertDatabaseHas('pegawai', [
            'id' => $pegawai->id,
            'nama' => 'Nama Baru',
            'jabatan' => 'Kepala Bengkel',
            'status' => 'Nonaktif',
        ]);
    }

    public function test_users_can_delete_an_employee(): void
    {
        $user = User::factory()->create();
        $pegawai = Pegawai::factory()->create();

        $this->actingAs($user)
            ->delete("/pegawai/{$pegawai->id}")
            ->assertRedirect('/pegawai');

        $this->assertDatabaseMissing('pegawai', ['id' => $pegawai->id]);
    }

    public function test_jasa_page_lists_services_from_the_database(): void
    {
        $user = User::factory()->create();

        Jasa::factory()->create([
            'kode_jasa' => 'JSA-9001',
            'nama_jasa' => 'Servis Rutin',
            'harga' => 150000,
        ]);

        $this->actingAs($user)
            ->get('/jasa')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Jasa/Index')
                ->has('jasa', 1)
                ->where('jasa.0.kode_jasa', 'JSA-9001')
                ->where('jasa.0.nama_jasa', 'Servis Rutin')
                ->where('jasa.0.harga', 150000)
            );
    }

    public function test_users_can_create_a_service(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/jasa', [
            'kode_jasa' => 'JSA-9002',
            'nama_jasa' => 'Ganti Oli',
            'harga' => 75000,
        ]);

        $response->assertRedirect('/jasa');
        $this->assertDatabaseHas('jasa', [
            'kode_jasa' => 'JSA-9002',
            'nama_jasa' => 'Ganti Oli',
            'harga' => 75000,
        ]);
    }

    public function test_creating_a_service_requires_valid_data(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/jasa', [])
            ->assertSessionHasErrors(['kode_jasa', 'nama_jasa', 'harga']);

        $this->assertDatabaseCount('jasa', 0);
    }

    public function test_service_code_must_be_unique(): void
    {
        $user = User::factory()->create();
        Jasa::factory()->create(['kode_jasa' => 'JSA-9003']);

        $this->actingAs($user)
            ->post('/jasa', [
                'kode_jasa' => 'JSA-9003',
                'nama_jasa' => 'Jasa Lain',
                'harga' => 50000,
            ])
            ->assertSessionHasErrors('kode_jasa');
    }

    public function test_users_can_update_a_service(): void
    {
        $user = User::factory()->create();
        $jasa = Jasa::factory()->create(['nama_jasa' => 'Nama Lama']);

        $response = $this->actingAs($user)->put("/jasa/{$jasa->id}", [
            'kode_jasa' => $jasa->kode_jasa,
            'nama_jasa' => 'Nama Baru',
            'harga' => 225000,
        ]);

        $response->assertRedirect('/jasa');
        $this->assertDatabaseHas('jasa', [
            'id' => $jasa->id,
            'nama_jasa' => 'Nama Baru',
            'harga' => 225000,
        ]);
    }

    public function test_users_can_delete_a_service(): void
    {
        $user = User::factory()->create();
        $jasa = Jasa::factory()->create();

        $this->actingAs($user)
            ->delete("/jasa/{$jasa->id}")
            ->assertRedirect('/jasa');

        $this->assertDatabaseMissing('jasa', ['id' => $jasa->id]);
    }

    public function test_kategori_page_lists_categories_from_the_database(): void
    {
        $user = User::factory()->create();

        Kategori::factory()->create([
            'kode_kategori' => 'KAT-9001',
            'nama_kategori' => 'Pelumas',
        ]);

        $this->actingAs($user)
            ->get('/kategori')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Kategori/Index')
                ->has('kategori', 1)
                ->where('kategori.0.kode_kategori', 'KAT-9001')
                ->where('kategori.0.nama_kategori', 'Pelumas')
            );
    }

    public function test_users_can_create_a_category(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/kategori', [
            'kode_kategori' => 'KAT-9002',
            'nama_kategori' => 'Filter',
        ]);

        $response->assertRedirect('/kategori');
        $this->assertDatabaseHas('kategori', [
            'kode_kategori' => 'KAT-9002',
            'nama_kategori' => 'Filter',
        ]);
    }

    public function test_creating_a_category_requires_valid_data(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/kategori', [])
            ->assertSessionHasErrors(['kode_kategori', 'nama_kategori']);

        $this->assertDatabaseCount('kategori', 0);
    }

    public function test_category_code_must_be_unique(): void
    {
        $user = User::factory()->create();
        Kategori::factory()->create(['kode_kategori' => 'KAT-9003']);

        $this->actingAs($user)
            ->post('/kategori', [
                'kode_kategori' => 'KAT-9003',
                'nama_kategori' => 'Kategori Lain',
            ])
            ->assertSessionHasErrors('kode_kategori');
    }

    public function test_users_can_update_a_category(): void
    {
        $user = User::factory()->create();
        $kategori = Kategori::factory()->create(['nama_kategori' => 'Nama Lama']);

        $response = $this->actingAs($user)->put("/kategori/{$kategori->id}", [
            'kode_kategori' => $kategori->kode_kategori,
            'nama_kategori' => 'Nama Baru',
        ]);

        $response->assertRedirect('/kategori');
        $this->assertDatabaseHas('kategori', [
            'id' => $kategori->id,
            'nama_kategori' => 'Nama Baru',
        ]);
    }

    public function test_users_can_delete_a_category(): void
    {
        $user = User::factory()->create();
        $kategori = Kategori::factory()->create();

        $this->actingAs($user)
            ->delete("/kategori/{$kategori->id}")
            ->assertRedirect('/kategori');

        $this->assertDatabaseMissing('kategori', ['id' => $kategori->id]);
    }

    public function test_produk_page_lists_products_from_the_database(): void
    {
        $user = User::factory()->create();
        $kategori = Kategori::factory()->create([
            'kode_kategori' => 'KAT-8001',
            'nama_kategori' => 'Pelumas',
        ]);

        Produk::factory()->create([
            'kode_produk' => 'BRG-8001',
            'nama_produk' => 'Oli Mesin 10W-40',
            'kategori_id' => $kategori->id,
            'satuan' => 'Btl',
            'stok' => 48,
            'harga_beli' => 55000,
            'harga_jual' => 65000,
            'diskon' => 10,
            'tanggal_masuk' => '2026-09-01',
        ]);

        $this->actingAs($user)
            ->get('/produk')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Produk/Index')
                ->has('produk', 1)
                ->has('kategori', 1)
                ->where('produk.0.kode_produk', 'BRG-8001')
                ->where('produk.0.nama_produk', 'Oli Mesin 10W-40')
                ->where('produk.0.satuan', 'Btl')
                ->where('produk.0.stok', 48)
                ->where('produk.0.harga_beli', 55000)
                ->where('produk.0.harga_jual', 65000)
                ->where('produk.0.diskon', 10)
                ->where('produk.0.kategori.nama_kategori', 'Pelumas')
            );
    }

    public function test_users_can_create_a_product(): void
    {
        $user = User::factory()->create();
        $kategori = Kategori::factory()->create();

        $response = $this->actingAs($user)->post('/produk', [
            'kode_produk' => 'BRG-8002',
            'nama_produk' => 'Filter Oli Universal',
            'kategori_id' => $kategori->id,
            'satuan' => 'Pcs',
            'stok' => 30,
            'harga_beli' => 35000,
            'harga_jual' => 45000,
            'diskon' => 5,
            'tanggal_masuk' => '2026-09-05',
        ]);

        $response->assertRedirect('/produk');
        $this->assertDatabaseHas('produk', [
            'kode_produk' => 'BRG-8002',
            'nama_produk' => 'Filter Oli Universal',
            'kategori_id' => $kategori->id,
            'satuan' => 'Pcs',
            'stok' => 30,
            'diskon' => 5,
        ]);
    }

    public function test_creating_a_product_requires_valid_data(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/produk', [])
            ->assertSessionHasErrors([
                'kode_produk',
                'nama_produk',
                'kategori_id',
                'satuan',
                'stok',
                'harga_beli',
                'harga_jual',
                'diskon',
                'tanggal_masuk',
            ]);

        $this->assertDatabaseCount('produk', 0);
    }

    public function test_product_rejects_invalid_satuan_and_diskon(): void
    {
        $user = User::factory()->create();
        $kategori = Kategori::factory()->create();

        $this->actingAs($user)
            ->post('/produk', [
                'kode_produk' => 'BRG-8003',
                'nama_produk' => 'Produk Uji',
                'kategori_id' => $kategori->id,
                'satuan' => 'Kilogram',
                'stok' => 1,
                'harga_beli' => 1000,
                'harga_jual' => 2000,
                'diskon' => 150,
                'tanggal_masuk' => '2026-09-05',
            ])
            ->assertSessionHasErrors(['satuan', 'diskon']);
    }

    public function test_product_code_must_be_unique(): void
    {
        $user = User::factory()->create();
        $kategori = Kategori::factory()->create();
        Produk::factory()->create([
            'kode_produk' => 'BRG-8004',
            'kategori_id' => $kategori->id,
        ]);

        $this->actingAs($user)
            ->post('/produk', [
                'kode_produk' => 'BRG-8004',
                'nama_produk' => 'Produk Lain',
                'kategori_id' => $kategori->id,
                'satuan' => 'Pcs',
                'stok' => 1,
                'harga_beli' => 1000,
                'harga_jual' => 2000,
                'diskon' => 0,
                'tanggal_masuk' => '2026-09-05',
            ])
            ->assertSessionHasErrors('kode_produk');
    }

    public function test_users_can_update_a_product(): void
    {
        $user = User::factory()->create();
        $produk = Produk::factory()->create(['nama_produk' => 'Nama Lama']);

        $response = $this->actingAs($user)->put("/produk/{$produk->id}", [
            'kode_produk' => $produk->kode_produk,
            'nama_produk' => 'Nama Baru',
            'kategori_id' => $produk->kategori_id,
            'satuan' => 'Lembar',
            'stok' => 99,
            'harga_beli' => 12000,
            'harga_jual' => 18000,
            'diskon' => 20,
            'tanggal_masuk' => '2026-10-01',
        ]);

        $response->assertRedirect('/produk');
        $this->assertDatabaseHas('produk', [
            'id' => $produk->id,
            'nama_produk' => 'Nama Baru',
            'satuan' => 'Lembar',
            'stok' => 99,
            'diskon' => 20,
        ]);
    }

    public function test_users_can_delete_a_product(): void
    {
        $user = User::factory()->create();
        $produk = Produk::factory()->create();

        $this->actingAs($user)
            ->delete("/produk/{$produk->id}")
            ->assertRedirect('/produk');

        $this->assertDatabaseMissing('produk', ['id' => $produk->id]);
    }

    public function test_category_used_by_a_product_cannot_be_deleted(): void
    {
        $user = User::factory()->create();
        $kategori = Kategori::factory()->create();
        Produk::factory()->create(['kategori_id' => $kategori->id]);

        $this->actingAs($user)
            ->delete("/kategori/{$kategori->id}")
            ->assertRedirect('/kategori');

        $this->assertDatabaseHas('kategori', ['id' => $kategori->id]);
    }

    public function test_pengguna_page_lists_users_from_the_database(): void
    {
        $user = User::factory()->create();
        User::factory()->create([
            'name' => 'Kasir Satu',
            'email' => 'kasir1@posbengkel.test',
            'role' => 'Kasir',
        ]);

        $this->actingAs($user)
            ->get('/pengguna')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Pengguna/Index')
                ->has('pengguna', 2)
            );
    }

    public function test_users_can_create_an_account(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/pengguna', [
            'name' => 'Kasir Baru',
            'email' => 'kasir.baru@posbengkel.test',
            'role' => 'Kasir',
            'password' => 'rahasia123',
        ]);

        $response->assertRedirect('/pengguna');
        $this->assertDatabaseHas('users', [
            'email' => 'kasir.baru@posbengkel.test',
            'role' => 'Kasir',
        ]);

        $created = User::query()->where('email', 'kasir.baru@posbengkel.test')->firstOrFail();
        $this->assertTrue(Hash::check('rahasia123', $created->password));
    }

    public function test_creating_an_account_requires_valid_data(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/pengguna', [])
            ->assertSessionHasErrors(['name', 'email', 'role', 'password']);
    }

    public function test_account_email_must_be_unique(): void
    {
        $user = User::factory()->create();
        User::factory()->create(['email' => 'duplikat@posbengkel.test']);

        $this->actingAs($user)
            ->post('/pengguna', [
                'name' => 'Nama Lain',
                'email' => 'duplikat@posbengkel.test',
                'role' => 'Admin',
                'password' => 'rahasia123',
            ])
            ->assertSessionHasErrors('email');
    }

    public function test_users_can_update_an_account_without_changing_the_password(): void
    {
        $user = User::factory()->create();
        $target = User::factory()->create([
            'name' => 'Nama Lama',
            'password' => 'password',
        ]);

        $response = $this->actingAs($user)->put("/pengguna/{$target->id}", [
            'name' => 'Nama Baru',
            'email' => $target->email,
            'role' => 'Admin',
            'password' => '',
        ]);

        $response->assertRedirect('/pengguna');
        $this->assertDatabaseHas('users', [
            'id' => $target->id,
            'name' => 'Nama Baru',
            'role' => 'Admin',
        ]);

        $target->refresh();
        $this->assertTrue(Hash::check('password', $target->password));
    }

    public function test_updating_an_account_can_change_the_password(): void
    {
        $user = User::factory()->create();
        $target = User::factory()->create(['password' => 'password']);

        $this->actingAs($user)->put("/pengguna/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'role' => $target->role,
            'password' => 'passwordbaru',
        ])->assertRedirect('/pengguna');

        $target->refresh();
        $this->assertTrue(Hash::check('passwordbaru', $target->password));
    }

    public function test_users_can_delete_an_account(): void
    {
        $user = User::factory()->create();
        $target = User::factory()->create();

        $this->actingAs($user)
            ->delete("/pengguna/{$target->id}")
            ->assertRedirect('/pengguna');

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/logout')
            ->assertRedirect('/login');

        $this->assertGuest();
    }
}
