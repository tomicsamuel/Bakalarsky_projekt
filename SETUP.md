# Nastavenie databázy

## 1. Vytvor súbor `.env` v root priečinku

```env
DATABASE_URL="postgresql://postgres:HESLO@localhost:5432/fei_finder"
```

Zmeň `HESLO` na tvoje PostgreSQL heslo.

## 2. Vytvor databázu

Otvor pgAdmin alebo psql:

```sql
CREATE DATABASE fei_finder;
```

## 3. Vytvor tabuľky

```bash
npx prisma migrate dev --name init
```

## 4. Naplň databázu programami

```bash
npx prisma db seed
```

## Hotovo

Spusti: `npm run dev`

