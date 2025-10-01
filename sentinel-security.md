# VersoriumX Universal Sentinel

## Optional configuration (override defaults)

| Key                     | Default (if omitted)                                 | Description |
|-------------------------|------------------------------------------------------|-------------|
| `malware-signatures`    | `https://raw.githubusercontent.com/VersoriumX/malware-db/main/signatures.json` | URL of a JSON file with known malicious SHA‑256 hashes. |
| `quarantine-branch`     | `sentinel/quarantine`                               | Temporary branch where quarantined files are stored. |
| `warning-message`       | `VersoriumX security Panel has quarantined your activity` | Message shown to the offender. |
| `dependency-updater`    | `renovate`                                          | Tool used to open safe‑upgrade PRs (`renovate` or `dependabot`). |
| `scan-schedule`         | `0 3 * * *`                                         | Cron expression for the daily scheduled run (UTC‑3 UTC). |
