# Mongo Basic Concept 
## 1. Glossary
| SQL Concept | MongoDb Concept |                            Concept                             |
| :---------: | :-------------: | :------------------------------------------------------------: |
|  database   |    database     |                            database                            |
|    table    |   collection    |                   a type of entry collection                   |
|     row     |    document     |                            a entry                             |
|   column    |      field      |                           a property                           |
|    index    |      index      |                             index                              |
| table join  | document inject | mongo db allow user to inject a document into another document |
| primary key |   primary key   |           mongo will auto make _id to be primary key           |


### 1.1 Database 
Multiple databases can be create in the mongodb, the default db is `db`, all dbs will be stored into the data directory. 
Each db in mongo db has its own collection and privilege.
- commands 
  - `show dbs`: list all db
  - `db`:current db
  - `use`: connect to a db

### 1.2 Document 

A Document is a collection of key - value pair, we call it BSON, the document in a collection does not need to have the same shape and type of the shape can also be different. For instance:
 ```json
    {
        "site":"www.baidu.com",
        "name":"aaaaaa"
    }
 ```

- side note: 
  1. entries in document is ordered 
  2. value can be different types
  3. case-sensitive 
  4. no replica key 
  5. key is string, in some extreme case key can be other type

- document name convention:
  1. key cannot contain \0. mongo db use \0 to indicate the end of key name
  2. `.` and $ got special meaning
  3. key start with _ means private 

### 1.3 Collection 
a collection is the set of document, every document in the collection can be different sharp. when insert the first document, the collection will be create. 
- collection convention:
  1. collection name cannot be empty string
  2. no `\0`
  3. no system. 
  4. no preserved keyword, for instance $
   
#### 1.3.1 Capped Collections
fixed size collection, high performance, and expirable queue(LRU)
```js
    db.createCollection("mycollection",{capped:true,size:100000/*bytes*/})
```
- note  
  1. if any data update in capped collection cause the size increment, the update will failed
  2. no delete, only drop all
  3. in 32 bit, maximum storage is 1e9

### 1.4 Meta Data 
db's metadata is stored inside collection, use system's namespace 
`dbname.system`
|   collection namespace   |             desc              |   extra   |
| :----------------------: | :---------------------------: | :-------: |
| dbname.system.namespaces |         all namespace         |           |
|  dbname.system.indexes   |          all indexes          | alterable |
|  dbname.system.profile   |        db profile info        | deletable |
|   dbname.system.users    |       db can be access        | alterable |
|   dbname.local.sources   | slave's server info and state |           |

### 1.5 database type
|     data type      |                desc                 |
| :----------------: | :---------------------------------: |
|       String       |                utf-8                |
|      Integer       |             32bit/64bit             |
|      Boolean       |                                     |
|       Double       |                                     |
|    Min/Max Keys    | a value compair with BSON's min/max |
|       Arrays       |                                     |
|     Timestamp      |                                     |
|       Object       |           document inline           |
|        Null        |                                     |
|       Symbol       |              js symbol              |
|        Date        |              unix date              |
|     Object ID      |             document id             |
|    Binary Data     |                blob                 |
|        Code        |               js code               |
| Regular Expression |                regex                |