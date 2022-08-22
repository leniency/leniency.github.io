---
title: Randomizing Data
date: 2014-04-18
description: ""
categories: []
tags: ["SQL"]
layout: "../../layouts/BlogPost.astro"
---

# Randomizing Data

Ideally, development and testing data is reasonably robust to allow for realistic testing. Occasionally though, pulling in a copy of the production database is useful to hunt down specific cases. Personal information should be scrubbed from this though.

http://www.generatedata.com/ is a great tool for generating large amounts of random data. It's easy to install a local copy too. Data sets can be saved and re-used. Large amounts of seed data for testing can also be created.

To replace existing columns with random data, its fairly straight forward to create an SQL script to do this.

```sql
USE YOUR_DATABASE_NAME

BEGIN TRANSACTION
GO

/* Drop temp table if exists. */
IF OBJECT_ID('tempdb..#RandomData') IS NOT NULL 
	DROP TABLE #RandomData
GO

/* Create the temp table. */
CREATE TABLE #RandomData (
    Id INTEGER NOT NULL IDENTITY(1, 1),
    FirstName NVARCHAR(255) NULL,
    LastName NVARCHAR(255) NULL,
    Street NVARCHAR(255) NULL,
    City NVARCHAR(255) NULL,
    PostalCode NVARCHAR(10) NULL,
    [State] NVARCHAR(50) NULL,
    Email NVARCHAR(255) NULL,
    Phone NVARCHAR(100) NULL,
    PRIMARY KEY (Id)
);
GO

/* Insert random data. This can be generated automatically from generatedata.com */
INSERT INTO #RandomData(FirstName,LastName,Street,City,PostalCode,State,Email,Phone) VALUES('Todd','Young','Ap #473-5868 Maecenas Avenue','Chandler','85414','AZ','id@sociisnatoquepenatibus.ca','(108) 354-7428');
/* ... Add more randomized data here .. */

GO

/* ------------------------------------------------------ */
/* Update tables from the temp table. */

UPDATE Registrants
SET
	Street = r.Street,
	City = r.City,
	PostalCode = r.PostalCode,
	State = r.[State],
	Email = r.Email,
	FirstName = r.FirstName,
	LastName = r.LastName,
	Phone = r.Phone
FROM Registrant.Transactions t
CROSS APPLY (
	SELECT TOP 1 *
	FROM #RandomData
	WHERE t.Id = t.Id   /* Yup, not a typo */
	ORDER BY NEWID()
) r


COMMIT TRANSACTION
GO
```

The general script runs as follows:

 - Create a temp table to store our random data for the duration of the transaction
 - Insert random data, generated from www.generatedata.com. This will need to be massaged a bit if going to MsSql.
 - Update appropriate tables and fields using CROSS APPLY
 - Woot! Data scrubbed!