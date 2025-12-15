# Návrhy na zlepšenie UX a UI

## 🎯 Prioritné zlepšenia (Vysoký dopad)

### 1. **Validácia formulára pred prechodom na ďalší krok**
- **Problém**: Používateľ môže kliknúť "Ďalej" bez vyplnenia povinných polí
- **Riešenie**: 
  - Disabled tlačidlo "Ďalej" ak nie je vyplnené povinné pole
  - Zobrazenie chybovej správy pri pokuse o prechod
  - Vizuálne zvýraznenie prázdnych polí (červený okraj)

### 2. **Loading stavy a feedback**
- **Problém**: Pri ukladaní výsledkov nie je jasné, že sa niečo deje
- **Riešenie**:
  - Loading spinner pri ukladaní
  - Disabled tlačidlo "Uložiť výsledky" počas ukladania
  - Progress indikátor pri načítaní histórie

### 3. **Počítadlo vybraných položiek**
- **Problém**: Používateľ nevie, koľko záujmov/praxí má vybraných
- **Riešenie**:
  - Zobrazenie počtu v hlavičke kategórie: "Programovanie (3 vybrané)"
  - Zobrazenie celkového počtu v nadpise kroku
  - Minimálne požiadavky: "Vyber aspoň 1 záujem (vybrané: 0)"

### 4. **Smooth scroll k výsledkom**
- **Problém**: Na mobile sa výsledky môžu zobraziť mimo obrazovky
- **Riešenie**:
  - Automatický scroll k výsledkom po vyplnení kroku
  - Smooth animácia pri zobrazení výsledkov

### 5. **Animácie pri prechode medzi krokmi**
- **Problém**: Prechod medzi krokmi je náhly
- **Riešenie**:
  - Fade in/out animácia pri zmene kroku
  - Slide animácia pre lepší pocit plynulosti

## 🎨 Vizuálne zlepšenia

### 6. **Zlepšenie steppera**
- **Aktuálny stav**: Jednoduché body
- **Vylepšenie**:
  - Spojovacie čiary medzi krokmi
  - Názvy krokov pod stepperom
  - Progress bar pod stepperom
  - Animácia pri aktivácii kroku

### 7. **Hover efekty a feedback**
- **Chýbajúce**:
  - Hover efekty na programoch v výsledkoch
  - Tooltip s krátkym popisom programu pri hover
  - Zvýraznenie pri hover na kategóriách

### 8. **Zlepšenie výsledkov**
- **Pridané funkcie**:
  - Ikona "srdce" na uloženie obľúbených programov
  - Tlačidlo "Zdieľať výsledky" (copy link)
  - Export výsledkov ako PDF/obrázok
  - Porovnanie programov (side-by-side)

### 9. **Empty states**
- **Kde**: Keď nie sú vybrané žiadne záujmy/prax
- **Riešenie**:
  - Ilustrácia alebo ikona
  - Pomocný text: "Začni výberom aspoň jedného záujmu"
  - Návodné tlačidlá

### 10. **Zlepšenie kategórií**
- **Pridané**:
  - Search/filter v kategóriách (ak je veľa možností)
  - Zobrazenie najpopulárnejších možností navrchu
  - "Vybrať všetko" / "Zrušiť výber" v kategórii
  - Zobrazenie počtu vybraných v každej kategórii

## ⚡ Funkčné zlepšenia

### 11. **Autosave progress**
- **Funkcia**: Automatické ukladanie priebehu do localStorage
- **Výhoda**: Ak používateľ zavrie stránku, môže pokračovať tam, kde skončil

### 12. **Zlepšenie accessibility**
- **Pridané**:
  - ARIA labels pre všetky interaktívne prvky
  - Screen reader friendly texty
  - Kontrast farieb podľa WCAG

### 13. **Error handling a recovery**
- **Pridané**:
  - Retry tlačidlo pri chybe ukladania
  - Offline mode s queue pre ukladanie
  - Zobrazenie chybových správ v čitateľnom formáte

### 14. **Zlepšenie výsledkov - detailné info**
- **Pridané**:
  - Expandovateľné sekcie v programoch
  - Zobrazenie dôvodov, prečo sa program hodí (na základe odpovedí)
  - Porovnanie s ostatnými programami
  - "Podobné programy" sekcia

## 📱 Mobile zlepšenia

### 16. **Mobile-first vylepšenia**
- **Pridané**:
  - Swipe gestá pre prechod medzi krokmi
  - Sticky header s progressom
  - Bottom sheet pre výsledky na mobile
  - Optimalizácia veľkosti tlačidiel (min 44x44px)

### 17. **Touch feedback**
- **Pridané**:
  - Haptic feedback (ak podporované)
  - Visual feedback pri kliknutí
  - Loading stavy pri touch

## 🎓 Edukačné prvky

### 18. **Pomocné tooltips**
- **Kde**: Pri komplikovaných otázkach
- **Príklad**: "Čo je to PLC programovanie?" - tooltip s vysvetlením

### 19. **Príklady a návody**
- **Pridané**:
  - "Príklad odpovede" pri otázkach
  - "Ako to funguje?" sekcia na začiatku
  - Video tutoriál (voliteľné)

### 20. **Zlepšenie program detail stránky**
- **Pridané**:
  - Galéria obrázkov
  - Video prezentácia programu
  - Kontakt na koordinátora programu
  - Link na oficiálnu stránku programu
  - Štatistiky (koľko študentov, úspešnosť, atď.)

## 🔄 Pokročilé funkcie

### 21. **História výsledkov**
- **Funkcia**: Zobrazenie všetkých predchádzajúcich testov
- **Výhoda**: Porovnanie, ako sa záujmy menili

### 22. **Personalizácia**
- **Funkcie**:
  - Uloženie obľúbených programov
  - Poznámky k programom
  - Nastavenia (notifikácie, téma)

### 23. **Social features**
- **Funkcie**:
  - Zdieľanie výsledkov na sociálnych sieťach
  - Porovnanie s priateľmi
  - Diskusné fórum pre programy

### 24. **Analytics dashboard** (pre používateľa)
- **Zobrazenie**:
  - Ktoré programy sa najčastejšie zobrazujú
  - Trendy v záujmoch
  - Odporúčania na základe histórie

## 🎨 Dizajnové vylepšenia

### 25. **Micro-interactions**
- **Pridané**:
  - Bounce animácia pri výbere chipu
  - Pulse efekt pri načítaní
  - Success checkmark animácia
  - Smooth transitions všade

### 26. **Zlepšenie farieb a kontrastu**
- **Kontrola**:
  - WCAG AA compliance
  - Zlepšenie čitateľnosti
  - Farbová paleta pre rôzne stavy (success, error, warning)

### 27. **Typography improvements**
- **Zlepšenie**:
  - Lepšia hierarchia textu
  - Optimalizácia veľkostí písma
  - Zlepšenie line-height pre čitateľnosť

## 📊 Priorita implementácie

### Vysoká priorita (Okamžite):
1. Validácia formulára
2. Loading stavy
3. Počítadlo vybraných položiek
4. Smooth scroll

### Stredná priorita (Čoskoro):
5. Animácie pri prechode
6. Zlepšenie steppera
7. Empty states

### Nízka priorita (Neskôr):
9. Social features
10. Analytics dashboard
11. Video tutoriály

---

**Tip**: Začni s validáciou a loading stavmi - majú najväčší dopad na UX s relatívne malou námahou.

