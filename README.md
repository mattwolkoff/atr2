# Mesonet Site Selection Tool #

 Avail labs

 reset stations

 ```
 update mesomap set "mapData" = subquery."mapData" from (SELECT "mapData" from mesomap where id = 1) as subquery where id = 4 
 update "user" set stations = '[]' where id = 1
