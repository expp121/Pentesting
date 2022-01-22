#!/bin/bash

# Delete any file in the log directory
# This script is executed by root every 2 minutes (via cron job)

rm -rfv /opt/admin/logs/*
