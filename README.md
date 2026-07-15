# StarScreen – prototyp na GitHub Pages

Statyczny prototyp katalogu filmów i seriali tworzonych w MovieStarPlanet.

## Co już działa

- strona główna z nowościami,
- katalog produkcji,
- wyszukiwanie i filtrowanie,
- strona produkcji,
- lista odcinków,
- powiązane produkcje,
- strona reżysera,
- status użytkownika: obejrzane / w trakcie / planuję / porzucone,
- lokalne oceny i recenzje,
- profil użytkownika.

Dane użytkownika są obecnie zapisywane w `localStorage`, czyli tylko w konkretnej przeglądarce. To wersja demonstracyjna. Aby użytkownicy mieli prawdziwe konta i wspólne recenzje, kolejnym etapem będzie podłączenie Supabase.

## Publikacja na GitHub Pages

1. Utwórz nowe publiczne repozytorium na GitHubie, np. `starscreen`.
2. Wgraj do niego wszystkie pliki z tego folderu.
3. Otwórz `Settings` → `Pages`.
4. W `Build and deployment` wybierz `Deploy from a branch`.
5. Wybierz branch `main` oraz folder `/ (root)` i kliknij `Save`.
6. Po publikacji strona będzie dostępna pod adresem podobnym do `https://twoja-nazwa.github.io/starscreen/`.

## Dodawanie produkcji

Na razie edytuj tablicę `window.PRODUCTIONS` w pliku `data.js`.

## Ważne

Projekt jest nieoficjalny i nie jest powiązany z MovieStarPlanet.
