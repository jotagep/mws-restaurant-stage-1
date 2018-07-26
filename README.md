# Mobile Web Specialist Certification Course
## Installation

-  Clone server repo: [Server Stage 3](https://github.com/udacity/mws-restaurant-stage-3) and follow them to start the server.

- Clone my repo in your computer and install **node modules** and dependencies

```
$ git git@github.com:jotagep/mws-restaurant-udacity.git
$ cd mws-restaurant-udacity
$ npm install
```
- Run a build version(optimized), with this command:

`$ gulp serve:dist` or `$ npm run serve:dist`

You can see your site live at port __8000__: [http://localhost:8000/](http://localhost:8000/)

---

#### _Three Stage Course Material Project - Restaurant Reviews_

## Stage 1 -- (DONE)

## Stage 2 -- (DONE)

## Stage 3 -- (DONE)

### Requirements

**Add a form to allow users to create their own reviews:** In previous versions of the application, users could only read reviews from the database. You will need to add a form that adds new reviews to the database. The form should include the user’s name, the restaurant id, the user’s rating, and whatever comments they have. Submitting the form should update the server when the user is online.

**Add functionality to defer updates until the user is connected:** If the user is not online, the app should notify the user that they are not connected, and save the users' data to submit automatically when re-connected. In this case, the review should be deferred and sent to the server when connection is re-established (but the review should still be visible locally even before it gets to the server.)

**Meet the new performance requirements:** In addition to adding new features, the performance targets you met in **Stage Two** have tightened. Using Lighthouse, you’ll need to measure your site performance against the new targets.

Lighthouse measures performance in four areas, but your review will focus on three:

- **Progressive Web App** score should be at **90** or better.
- **Performance** score should be at **90** or better.
- **Accessibility** score should be at **90** or better.

You can audit this site performance with Lighthouse by using the Audit tab of Chrome Dev Tools to check results 🙂.

### My results (FINAL STAGE 3)

Provided by Lighthouse

![alt text](http://i67.tinypic.com/dvmupt.png "Test results stage 3")

---

#### Thanks all! Fork and enjoy this repo! 👍


