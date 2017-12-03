# AcademicArticleManager
OO Software Developement project for COP4331

AcademicArticleManager is a class project for COP 4331 - Processes of Object Oriented Software - at the University of Central Florida.
This web application is an Express app built on Node.js with a MongoDB for storage.
There's not much exceptional going on here, and enough poking will reveal holes, but it works for what it is.

The goal of this project was to create a website that acts a database for academic articles. The website was to have user accounts that can upload articles, download articles, and add articles to a bookmarks list. Upon uploading an article, it is to be parsed for meaningful data, including author, title, and to be categorized by subject and keyword. 
For the parser we used two outside resources: meaningcloud.com to categorize by subject, and grobid, a machine learning API designed specifically to parse academic articles.
