#!/bin/bash
BACKUP_DIR=$1

mkdir -p $BACKUP_DIR

Date=`date +%Y%m%d`

cd $BACKUP_DIR

DumpFile=$Date.sql

GZDumpFile=$Date.sql.tgz

docker exec $CONTAINER_NAME $DUMP_PATH -U $USER -p $PORT $DATABASE  > $DumpFile

tar -zvcf $GZDumpFile $DumpFile

rm $DumpFile
