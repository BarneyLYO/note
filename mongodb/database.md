# Create Database
`use DATABASE_NAME` will automatically create a not existing data base.
```
> use mongo  
switched to db mongo  
> db 
mongo 
>   
```
# show dbs
```
> show dbs  
local  0.078GB  
test   0.078GB   
```
# real create 
```
> use mongo  
switched to db mongo  
> db 
mongo 
> db.mongo.insert({"name":"mongodb中文网"})
WriteResult({ "nInserted" : 1 })  
> show dbs  
local   0.078GB  
mongo  0.078GB 
test    0.078GB  
>      
```
