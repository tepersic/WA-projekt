# WA-projekt

Rate your profesor

Frontend
Sadrži šest stranica- Admin.vue u kojoj je lista svih korisnika i gjde admin moze pormovirat normalnog korisnika u admina i obrnuto i jos moze izbrisati korisnika
                    - Home.vue početna stranica gdje pišu na kratko kako koristiti aplikaciju i pravila za komentare
                    - Login.vue stranica za prijavu
                    - Register.vue stranica za registrirat trazi nadimak,email,sifra i ponovno sifru
                    - Profesori.vue stranica koja sadrzi listu nastavnika i prikazuje ime nastavnika i njihovu organizacijsku 
                    jedinicu i moguce je pretražit nastavnike po imenu ili po organizacijskoj jedinici 
                    -Porfesor.vue stranica na kojoj je pokazan profil nastavnika i forma za komentare i ocjenu i lista 
                     komentara i ocjene
Onda ima App.vue u kojoj se nalazi toolbar i navbar također sa provjerom korisnika dali je normalan user ili admin
jos ima config.js gdje gjde ze nalazi link za frontend 
i router.js gdje su postavljene rute za stranice

Backend 
middleware-authMiddleware.js u kojoj se nalazi autentikacija korinsika i middleware za provjeru admina

routes-userRoutes.js u kojoj su funkcije vezane za registraciju, prijavu, promoviranje korisnika, demotiranje korisnika, brisanje korisnika, brisanje komentara i za ispisanje listu korisnika.

db.js funkcija za spajanje na bazu podataka u mongodb

index.js u kojoj su funkcije za autentikaciju korinsika, dobit listu nastavnika, pojedinačni nastavnik i za dodat komentar nastavniku

