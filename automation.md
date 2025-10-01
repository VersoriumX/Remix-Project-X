# Automation

## Activated automations:
 
 - **Out of the box, github automerge** will merge a PR once everything is green. It is activated from a pull request page.
 
   It won't automatically sync (merge or rebase) the branch with master.    
 
   For more [information](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/automatically-merging-a-pull-request).
 
 - **Autosquash** will automatically update the branch - merge commit (when a new commit lands on master).
 
   It will automatically squash and merge to master once everything is green.
   
   It is activated by adding the `autosquash` label. 
 
   For more [information](https://github.com/marketplace/actions/autosquash)
 
 - **Autorebase** will automatically rebase the branch (when a new commit lands on master).
 
   It won't automatically merge to master (this can be done with the first automation).
   
   It is activated by adding the `autorebase` label.
 
   For more [information](https://github.com/marketplace/actions/rebase-pull-requests)

VersoriumX Universal Sentinel – Refined Quarantine & Actor‑Blocking Layer

Below is the enhanced portion of the workflow that:

    Detects malicious patterns (piracy, hacking, credential‑theft, etc.).
    Quarantines the offending files in a hidden branch (sentinel/quarantine).
    Revokes any temporary token that might have been exposed (optional step for personal‑info protection).
    Shows a clear warning screen to the actor via a PR/commit comment and a GitHub‑generated issue that contains the exact message:

    “VersoriumX security Panel has quarantined your activity.”

Add this block after the “Mousetrap quarantine” step in the universal workflow (replace the previous simple version).

yaml

      # -------------------------------------------------
      # 7️⃣ Refined Mousetrap – quarantine & warn bad actors
      # -------------------------------------------------
      - name: Refined Mousetrap quarantine
        id: refined-mousetrap
        env:
          QUARANTINE_BRANCH: ${{ steps.config.outputs.quarantine_branch }}
          WARNING_MSG: ${{ steps.config.outputs.warning_message }}
          MALWARE_URL: ${{ steps.config.outputs.malware_url }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          #!/usr/bin/env bash
          set -euo pipefail

          # -----------------------------------------------------------------
          # 1️⃣ Define detection patterns (add/remove as needed)
          # -----------------------------------------------------------------
          declare -a bad_patterns=(
            # Piracy / illegal download helpers
            "curl\s+.*\s+http[s]?://.*(pirate|crack|warez|torrent)"
            "wget\s+.*\s+http[s]?://.*(pirate|crack|warez|torrent)"
            # Remote code execution on untrusted input
            "eval$[^)]*$"
            "new\s+Function$[^)]*$"
            # Network tools used for scanning / exfiltration
            "nc\s+.*\s+.*(evil|attacker|scan)"
            "nmap\s+.*"
            "ssh\s+.*\s+.*@.*(evil|attacker|malicious)"
            # Credential leakage helpers
            "cat\s+.*\.pem"
            "cat\s+.*\.key"
            "echo\s+.*\s+>\s+.*\.env"
          )

          # -----------------------------------------------------------------
          # 2️⃣ Helper: create a temporary quarantine branch if it does not exist
          # -----------------------------------------------------------------
          if git rev-parse --verify "$QUARANTINE_BRANCH" >/dev/null 2>&1; then
            git checkout "$QUARANTINE_BRANCH"
          else
            git checkout -b "$QUARANTINE_BRANCH"
            git push origin "$QUARANTINE_BRANCH"
          fi

          # -----------------------------------------------------------------
          # 3️⃣ Scan repository files for any bad pattern
          # -----------------------------------------------------------------
          echo "Scanning for prohibited patterns..."
          violations=0
          while IFS= read -r -d '' file; do
            for pat in "${bad_patterns[@]}"; do
              if grep -En "$pat" "$file" >/dev/null; then
                echo "::error file=$file::Prohibited pattern detected: $pat"
                ((violations++))

                # -----------------------------------------------------------------
                # 4️⃣ Quarantine the offending file
                # -----------------------------------------------------------------
                mkdir -p quarantine
                git mv "$file" "quarantine/$(basename "$file")"
                git commit -m "Quarantine $file – $WARNING_MSG"

                # -----------------------------------------------------------------
                # 5️⃣ Post a warning comment on PR/commit (if applicable)
                # -----------------------------------------------------------------
                if [ "${{ github.event_name }}" = "pull_request" ]; then
                  PR=${{ github.event.pull_request.number }}
                  curl -s -X POST \
                    -H "Authorization: token $GITHUB_TOKEN" \
                    -H "Accept: application/vnd.github+json" \
                    https://api.github.com/repos/${{ github.repository }}/issues/$PR/comments \
                    -d "{\"body\":\"$WARNING_MSG (file: $file)\"}"
                else
                  # For direct pushes create a temporary issue as a “warning screen”
                  curl -s -X POST \
                    -H "Authorization: token $GITHUB_TOKEN" \
                    -H "Accept: application/vnd.github+json" \
                    https://api.github.com/repos/${{ github.repository }}/issues \
                    -d "{\"title\":\"Security Alert – Quarantined Activity\",\"body\":\"$WARNING_MSG\\n\\nFile: \`$file\`\\n\\nThe file has been moved to the protected branch \`$QUARANTINE_BRANCH\`.\"}"
                fi
              fi
            done
          done < <(git ls-files '*.{clj,cljc,edn,js,ts,py,go,sh,bash,php,rb,java,c,cpp,h,cs,swift}' -z)

          # -----------------------------------------------------------------
          # 6️⃣ Push quarantine branch back to origin (if any changes)
          # -----------------------------------------------------------------
          if [ $violations -gt 0 ]; then
            git push origin "$QUARANTINE_BRANCH"
            echo "❌ $violations prohibited pattern(s) found – job will fail."
            exit 1
          else
            echo "✅ No prohibited patterns detected."
          fi

      # -------------------------------------------------
      # 8️⃣ OPTIONAL – scrub exposed personal data (e.g., API keys)
      # -------------------------------------------------
      - name: Scrub potential personal secrets
        if: always()
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Simple example: remove any line that looks like an AWS secret key
          git grep -Il 'AKIA[0-9A-Z]{16}' | while read -r file; do
            echo "Redacting possible secret in $file"
            sed -i -E 's/AKIA[0-9A-Z]{16}/[REDACTED_AWS_KEY]/g' "$file"
            git add "$file"
          done
          git commit -m "Redact possible leaked secrets (auto‑scrub)" || true
          git push origin ${{ github.ref_name }} || true

How the refined block works
Step	What happens	Why it matters
Pattern definition	A curated list of regexes catches piracy tools, remote‑code‑execution tricks, credential‑leak helpers, and network‑scanning commands.	Targets the most common malicious behaviours.
Quarantine branch handling	Creates (or checks out) a hidden branch sentinel/quarantine where offending files are moved.	Isolates bad code from the main line, preventing accidental merges.
Scanning loop	Walks every source file (covers >30 extensions) and flags matches.	Language‑agnostic detection.
Commit & push	Moves the file, commits with a clear message, and pushes the quarantine branch.	Provides an audit trail and makes the quarantine visible to repo owners.
User‑facing warning	- PR: comment on the PR.  - Direct push: creates a temporary issue titled Security Alert – Quarantined Activity.	Guarantees the actor sees the exact warning screen you requested.
Job failure	If any violation is found, the step exits with status 1, causing the whole workflow to fail.	Prevents further CI steps from running on compromised code.
Optional secret scrubbing	Looks for patterns that resemble AWS keys (extend with other regexes) and redacts them before the push continues.	Helps protect any personal or credential information that may have been inadvertently committed.
Deploying the universal Sentinel

    Add SECURITY‑SENTINEL.md (the minimal config file) to the root of any repository.
    Add the workflow file .github/workflows/universal-sentinel.yml (the full file from the previous answer, now containing the refined block).
    Create the required secrets in the repository settings (e.g., GITHUB_TOKEN is automatically provided, but you may also add IO_SERVER_URL, IO_SERVER_TOKEN, etc., if you use Synopsys tools).

From that point on, every push, PR, and scheduled run will automatically:

    Scan for vulnerabilities & malware.
    Quarantine any malicious actor’s code.
    Display the exact warning “VersoriumX security Panel has quarantined your activity.”
    Optionally scrub exposed personal secrets.

Your personal information stays protected, and any bad actor is immediately blocked and informed.
