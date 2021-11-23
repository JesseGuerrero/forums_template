This is a snapshot of the presentation we had last Monday. After the end of the semester I may convert this repo to another website. Here are the steps to run it:
1. Create a node environment
2. Clone codebase
3. install mongodb's module into node with this command in the environment, "npm install mongodb"
4. Setup a local Mongo server instance on port 27017 and run it
5. Create databases "forum" and "website", it is case sensitive
6. Inside database "website" create a  "Users" collection, leave database "forum" blank or with one filler collection to keep the database registered.
7. Run the app once and it will error out while creating and populating the forum in MongoDB.
8. Run again and go to "localhost:80". 

Now that the forum database is populated you can view the posts and threads, create an account and follow all the use cases. After that you <i>should</i> be able to run the website locally.

If you cannot run it please email me and I will update the github repo with additional steps or edit the source to work better from an external clone.
