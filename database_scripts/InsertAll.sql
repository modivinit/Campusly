BEGIN;
\i CreatePostGIS.sql
\i AlterPostGisTableAndAddTrigger.sql
\i InsertUser.sql
\i InsertRoomsAndProperties.sql
\i InsertAptComplexes.sql
\i newuniversitydump.sql
\i InsertEducation.sql
\i InsertAddressHistory.sql
\i InsertLooking.sql
\i InsertRoommate.sql
\i user_status_table.sql
COMMIT;
