#!/bin/bash
kubectl exec -n three-tier postgres-0 -- pg_dump -U devops appdb > backup_$(date +%F).sql
