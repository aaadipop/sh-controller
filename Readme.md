## .sh controller

Acest proiect este un simplu controler pentru script-uri shell, care permite utilizatorilor să execute diferite script-uri printr-o interfață web.

## Rulare

1. **Instalare dependențe**: Instalare Node.js și dependințle necesare pentru proiect, rulând comanda:

    ```bash
    npm install
    ```

2. **Configurare**: Nu sunt necesare configurări specifice.

3. **Rulare**: Pornirea serverului folosind comanda:

    ```bash
    node app.js
    ```

## Mod de funcționare

Aplicația oferă un endpoint pentru listarea și executarea script-urilor shell disponibile. Utilizatorii pot vedea lista de script-uri și pot executa un script specific.

## Spawn

Pentru a executa script-urile shell, aplicația utilizează funcția `spawn` din modulul `child_process` al Node.js. Această funcție permite crearea și controlul unui proces copil și comunicarea cu acesta prin intermediul fluxurilor de intrare și ieșire. În esență, `spawn` începe executarea unui proces extern specificat de utilizator, în acest caz, script-urile shell.

Atunci când execuția unui script este inițiată, aplicația deschide un canal de comunicare cu procesul copil pentru a trimite datele necesare și pentru a primi rezultatele. Aceasta include gestionarea fluxului de date de ieșire (stdout) și, opțional, a fluxului de date de eroare (stderr). Astfel, aplicația poate captura mesajele de ieșire și erorile generate de script și să le afișeze în mod corespunzător în interfața utilizatorului sau să le trateze în consecință.

Este important de menționat că `spawn` rulează asincron, ceea ce înseamnă că aplicația poate continua să ruleze alte procese sau să răspundă la alte cereri în timp ce execută script-ul. De asemenea, este necesar să se gestioneze corect evenimentele asociate cu procesul copil, cum ar fi închiderea sau terminarea acestuia, pentru a asigura o execuție robustă a script-urilor și a aplicației în ansamblu.

## Autentificare

Pentru a accesa aplicația, utilizatorii trebuie să se autentifice cu un nume de utilizator și o parolă. În prezent, credențialele de autentificare sunt setate ca "admin:admin". Autentificarea se face folosind autentificarea de bază (Basic Authentication).

## Comenzi de execuție

Pentru a accesa pagina principală și a lista script-urile disponibile, se poate folosi următoarea comandă `curl`:

```bash
curl -X GET http://localhost:3000/ --user admin:admin
curl -X POST http://localhost:3000/run/scriptX.sh --user admin:admin, unde X={1,2,3}
```

## Deploy

```bash
# Construirea imaginii Docker
docker build -t sh-controller .

# Rularea containerului Docker
docker run -e USERNAME=admin -e PASSWORD=admin -p 3000:3000 sh-controller
```
