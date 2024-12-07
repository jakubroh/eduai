# EduAI - Školní AI Asistent

EduAI je platforma pro české školy, která umožňuje bezpečné a kontrolované využívání AI asistenta ve vzdělávání.

## Funkce

- Správa škol a uživatelů
- Kreditový systém pro kontrolu využití
- Chat rozhraní s AI asistentem
- Podpora matematických vzorců a kódu
- Historie konverzací
- Administrace a monitoring

## Technologie

- Next.js 14 s App Routerem
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- NextAuth.js
- Claude AI (Anthropic)
- Monaco Editor

## Požadavky

- Node.js >= 16.13.0
- PostgreSQL >= 12
- NPM >= 8

## Instalace

1. Naklonujte repozitář:
```bash
git clone https://github.com/[username]/eduai.git
cd eduai
```

2. Nainstalujte závislosti:
```bash
npm install
```

3. Vytvořte soubor `.env` podle `.env.example`:
```bash
cp .env.example .env
```

4. Upravte proměnné prostředí v `.env`:
- Nastavte `DATABASE_URL` pro vaši PostgreSQL databázi
- Vygenerujte `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Vygenerujte `ENCRYPTION_KEY`: `openssl rand -hex 32`
- Přidejte váš `ANTHROPIC_API_KEY`

5. Inicializujte databázi:
```bash
npx prisma generate
npx prisma db push
```

## Vývoj

Spuštění vývojového serveru:
```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:3000`

## Produkční build

```bash
npm run build
npm start
```

## Deployment na Vercel

1. Vytvořte nový projekt na Vercel
2. Propojte s GitHub repozitářem
3. Nastavte Environment Variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `ENCRYPTION_KEY`
   - `ANTHROPIC_API_KEY`
4. Deploy

## Licence

MIT License - viz [LICENSE](LICENSE)