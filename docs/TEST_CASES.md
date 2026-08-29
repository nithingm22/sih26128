# End-to-End Test Cases — Data & Surveillance Module

Run through this yourself at least twice before the final rehearsal phase.
Log every bug you find in the group chat with a clear description and who
owns the fix. The morning of the demo, run `seed_data.py` against a fresh/
reset database and re-check this whole list — don't trust data that's been
manually tweaked overnight.

## Core demo flow

- [ ] Farmer can log in
- [ ] Farmer can view their animal list
- [ ] Farmer can submit a report with internet on — risk result + advisory appear
- [ ] Farmer can submit a report with internet OFF — "saved offline" appears, no crash
- [ ] Turning internet back on syncs the offline report automatically
- [ ] Vet can log in and see the case in their case list
- [ ] Vet can open the case and see the same risk explanation the farmer saw
- [ ] Vet can update the case status and it reflects correctly
- [ ] Admin can see the map with individual case pins
- [ ] Admin can see the deliberate cluster highlighted differently from single cases
- [ ] Admin dashboard summary numbers match the actual seeded data
- [ ] Full flow survives a fresh database reset + reseed

## Data & file sanity

- [ ] `python -m json.tool demo-data/seed.json` runs clean, no errors
- [ ] `python -m json.tool demo-data/cluster_scenario.json` runs clean, no errors
- [ ] No duplicate IDs anywhere in either file
- [ ] No ID collisions between the two files (seed.json uses 1-28, cluster_scenario.json uses 9000+)
- [ ] Every animal's `owner_id` points to a real farmer
- [ ] Every report's `animal_id` points to a real animal
- [ ] Every case's `report_id` points to a real report

## Cluster detection — the "aha moment"

- [ ] The 4 deliberate cluster reports (same disease, same nearby hamlets, same week) actually trigger a cluster when run through the real `cluster_service.py`
- [ ] Only 3 same-disease/nearby/recent reports do NOT trigger a cluster
- [ ] 4 same-disease reports that are >5km apart do NOT trigger a cluster
- [ ] 4 same-disease, nearby reports spread across more than 7 days do NOT trigger a cluster
- [ ] 4 nearby, same-week reports with 4 *different* top diseases do NOT trigger a cluster
- [ ] A report sitting just outside the 5km radius of an otherwise-valid group of 3 does NOT get pulled in
- [ ] The general seed.json background data (not meant to cluster) does NOT accidentally trigger a false cluster

## Map

- [ ] Every seeded report shows up as a pin on the Leaflet map
- [ ] Pins for different farms use genuinely distinct coordinates (not stacked on one point)
- [ ] The cluster circle on the map visually contains all 4 of its member pins

## Before the actual demo

- [ ] Ran this whole checklist twice, logged bugs, confirmed fixes
- [ ] Re-ran `seed_data.py` on a clean reset the morning of the demo
- [ ] Confirmed `GET /clusters` still returns exactly the expected cluster after reseeding
