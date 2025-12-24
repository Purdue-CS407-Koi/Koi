# Koi

[![codecov](https://codecov.io/gh/Purdue-CS407-Koi/Koi/branch/main/graph/badge.svg?token=6PRT0RZ4ZR)](https://codecov.io/gh/Purdue-CS407-Koi/Koi)

## Setup

Create an `.env` file with the following contents:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Updating Supabase types

Run:

```
pnpm exec supabase login     # Interactive login to Supabase with browser
pnpm exec supabase gen types --lang=typescript --project-id fjnpeofxeihbuaswyyuq > src/helpers/supabase.types.ts
```

### Warning

On Windows, PowerShell outputs in UTF-16LE by default, which is not compatible
with most tools like Git. Use the following command instead:

```
pnpm exec supabase gen types --lang=typescript --project-id fjnpeofxeihbuaswyyuq | Out-File -FilePath src/helpers/supabase.types.ts -Encoding UTF8NoBOM
```

This command does require PowerShell v6 or higher, which is not installed by
default, even on latest releases of Windows 11. You can verify which version
of PowerShell you have installed with `$PSVersionTable.PSVersion`.

To update PowerShell, run:

```
winget install --id Microsoft.PowerShell --source winget
```

